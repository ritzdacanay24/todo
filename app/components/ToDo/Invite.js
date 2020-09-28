import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Image from 'react-bootstrap/Image';
import log from '../../images/default.jpg';
import { NotificationManager } from 'react-notifications';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

const Invite = props => {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async function fetchData() {
            const result = await repo.ListService.getSubscribers(props.currentUser._id, props.currentView._id);
            setData(result.data);
        }
        if (show) fetchData();
        if (!show) setSearchTerm("");
    }, [show]);

    useEffect(() => {
        const listResults = searchTerm && data.filter(data =>
            data.firstName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(listResults);
    }, [searchTerm]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
        event.persist();
    };

    const invite = async (e, user) => {
        let params = {
            fromEmail: props.currentUser.email,
            fromId: props.currentUser._id,
            toEmail: user.email,
            toId: user._id,
            listId: props.currentView._id
        }
        await repo.ListService.listInvite(params);
        NotificationManager.success('Invite sent');
        setShow(!show);
    }

    const getButtonDisplayMessage = (user) => {
        let res = {};
        res.isDisabled = false;
        res.buttonMessage = "Invite";

        if (user.subscribedTo && user.subscribedTo.isSubscribed) {
            res.isDisabled = true;
            res.buttonMessage = "Subscribed";
        } else if (user.subscribedTo && !user.subscribedTo.isSubscribed) {
            res.isDisabled = true;
            res.buttonMessage = "Pending Invite";
        } else if (props.currentUser._id == user._id) {
            res.isDisabled = true;
            res.buttonMessage = "Current User";
        }

        return res;
    }

    return (
        <div ref={ref}>
            <Button onClick={handleClick} className="float-right btn-orange"><i className="fa fa-users" aria-hidden="true"></i> Invite</Button>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref.current}
                containerPadding={20}
            >
                <Popover id="popover-contained" className="shadow invite" style={{ position: "relative" }}>
                    <Popover.Title as="h1">Invite to List </Popover.Title>
                    <Popover.Content>
                        <input
                            type="search"
                            name="searchList"
                            className="form-control sticky-top sticky-top-search"
                            placeholder="Email address or name"
                            value={searchTerm}
                            onChange={handleChange}
                            autoComplete="off"
                            autoFocus
                        />
                        <br />
                        <div className="filter-content" style={{ overflowY: "scroll", height: "282px" }}>
                            {!searchResults.length && searchTerm &&
                                <li className="list-group list-group-flush list-group-item pointer">
                                    User not found in the system. Please enter their email to invite them
                                </li>
                            }
                            {searchResults && searchResults.map((user, index) => {
                                let buttonResults = getButtonDisplayMessage(user);
                                return (
                                    <li key={index} className="list-group list-group-flush list-group-item pointer">
                                        <Image src={log} roundedCircle style={{ width: "30px" }} /> {" "} {user.firstName} <br /> {user.email} <br />
                                        <Button onClick={(e) => invite(e, user)} className="btn-sm btn-orange" block disabled={buttonResults.isDisabled}>{buttonResults.buttonMessage}</Button>
                                    </li>
                                )
                            })}
                        </div>
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    );
}

export default Invite;


