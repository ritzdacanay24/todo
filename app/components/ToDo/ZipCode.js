import React, { useState, useRef, useEffect } from 'react';
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import { NotificationManager } from 'react-notifications';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

const ZipCode = props => {
    const [zipCode, setZipCode] = useState(89101);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const fetchData = async (e) => {
        if(e) e.preventDefault()
        await repo.KrogerService.isAccessTokenExpired();
        let res = await repo.KrogerService.searchLocationByZipCode(zipCode);
        setData(res.data.data);
    }

    useEffect(() => {
        let locationInfo = JSON.parse(localStorage.getItem("GroceryToDo"));
        if(locationInfo) {
            setZipCode(locationInfo.address.zipCode);
            fetchData()
        }
    },[]);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const setLocation = async (item) => {
        localStorage.setItem('GroceryToDo', JSON.stringify(item));
        setZipCode(item.address.zipCode);
        NotificationManager.success('Location is set.');
    }

    return (
        <div ref={ref}>
            <Button onClick={handleClick}>{zipCode ? zipCode : 'Set zip code'}</Button>

            <Overlay
                show={show}
                target={target}
                placement="bottom"
                container={ref.current}
                containerPadding={20}

            >
                <Popover id="popover-contained" style={{minWidth: "400px", minHeight: "350px", overFlow:"auto"}} className="shadow">
                    <Popover.Title as="h3">Select store to view items</Popover.Title>
                    <Popover.Content>
                        <p>Locations near {zipCode ? zipCode : 'Set zip code'}</p>
                        <Form autoComplete="off" onSubmit={fetchData}>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1" className="btn-orange" onClick={fetchData}>Zip Code</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control name="searchTerm" type="search" placeholder="Enter zip code" value={zipCode} onChange={e => setZipCode(e.target.value)} />
                            </InputGroup>
                        </Form>

                        <ListGroup>
                            {data.map((item, index) => (
                                <ListGroup.Item key={index} action onClick={() => setLocation(item)}>{item.name} {item.address.addressLine1} {item.address.zipCode}</ListGroup.Item>
                            ))}
                        </ListGroup>
                        <br />
                        <button className="btn btn-orange btn-block" onClick={() => setShow(false)}>Close</button>
                    </Popover.Content>
                </Popover>
            </Overlay>
        </div>
    );
}

export default ZipCode;


