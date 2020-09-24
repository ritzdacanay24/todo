import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Image from 'react-bootstrap/Image';
import log from '../../images/default.jpg';

import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

import { NotificationManager } from 'react-notifications';

const Invite = props => {

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchData = async function fetchData() {
            const result = await repo.UserService.getAll();
            setData(result.data);
        }
        fetchData();
    }, []);

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
    };

    const invite = async user => {
        let params = {
            fromEmail: props.currentUser.email,
            fromId: props.currentUser._id,
            toEmail: user.email,
            toId: user._id,
            listId: props.currentView._id
        }
        let res = await repo.ListService.listInvite(params);
        NotificationManager.success('Invite sent');
    }

    return (
        <div ref={ref}>
            <Button onClick={handleClick} className="float-right btn-orange">Invite</Button>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref.current}
                containerPadding={20}
            >
                <Popover id="popover-contained" className="shadow invite" style={{ position: "relative" }}>
                    <Popover.Title as="h1">Invite to List (Under construction) </Popover.Title>
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
                                return (
                                    <li key={index} className="list-group list-group-flush list-group-item pointer">
                                        <Image src={log} roundedCircle style={{ width: "30px" }} /> {" "} {user.firstName} <br /> {user.email} <br />
                                        <Button onClick={() => invite(user)} className="btn-sm btn-orange" block>Send Invite</Button>
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


