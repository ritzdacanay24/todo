import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import './profile.css';

import food from '../../images/food.jpg';
import ItemService from "../../services/item.service";
import UserService from "../../services/user.service";

const Profile = ({ currentUser }) => {

    const [data, setData] = useState({});
    const [userData, setUserData] = useState(currentUser);

    useEffect(() => {
        const fetchData = async function fetchData() {
            const result = await ItemService.getOverview(currentUser._id);
            console.log(result)
            setData(result.data);
        }
        fetchData();
    }, []);

    const handleOnChange = (e) => {
        setUserData({...userData, [e.target.name] : e.target.value})
    }

    const saveUserInfo = async () => {
        delete userData._id
        delete userData.__v
        let res = await UserService.updateUserInfo(currentUser._id, userData);
        location.reload();

    }

    return (
        <div className="container main-secction shadow" style={{ padding: "77px 20px" }}>
            <div className="row" style={{ marginLeft: "0", marginRight: "0" }}>
                <div className="col-md-12 col-sm-12 col-xs-12 image-section">
                    <img src={food} style={{ objectFit: "cover" }} />
                </div>
                <div className="row" style={{ marginLeft: "0", marginRight: "0" }}>
                    <div className="col-md-3 col-sm-3 col-xs-12 user-profil-part">
                        <div className="row ">
                            <div className="col-md-12 col-md-12-sm-12 col-xs-12 user-image text-center">
                                <img className="shadow" src={require(`../../images/${currentUser.avitar}`)} style={{ objectFit: "cover" }} />
                            </div>
                            <div className="col-md-12 col-sm-12 col-xs-12 user-detail-section1 text-center">
                                <button className="btn btn-defult follow "><i className="fa fa-user-o" aria-hidden="true"></i> Overall</button>
                            </div>
                            <div className="row user-detail-row">
                                <div className="col-md-12 col-sm-12 user-detail-section2 pull-left">
                                    <div className="border"></div>
                                    <p>TOTAL ITEMS</p>
                                    <span>{data.total}</span>
                                </div>
                                <div className="col-md-12 col-sm-12 user-detail-section2 pull-right">
                                    <div className="border"></div>
                                    <p>TOTAL SPENT</p>
                                    <span>$ {parseFloat(data.totalCost).toFixed(2)}</span>
                                </div>
                                <div className="col-md-12 col-sm-12 user-detail-section2 pull-right">
                                    <div className="border"></div>
                                    <p>PERFORMANCE</p>
                                    <span>{((data.completed / data.total) * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-sm-9 col-xs-12 pull-right profile-right-section">
                        <div className="row profile-right-section-row">
                            <div className="col-md-12 profile-header">
                                <div className="row">
                                    <div className="col-md-8 col-sm-6 col-xs-6 profile-header-section1 pull-left">
                                        <h1>{currentUser.firstName} {currentUser.lastName}</h1>
                                        <p>Expert shopper</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <Form>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="Enter email" value={userData.email} name="email" onChange={handleOnChange}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter first name" value={userData.firstName} name="firstName" onChange={handleOnChange}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter last name" value={userData.lastName} name="lastName" onChange={handleOnChange}/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group controlId="formGridAddress2">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control placeholder="Apartment, studio, or floor" value={userData.address} name="address" onChange={handleOnChange}/>
                                    </Form.Group>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="formGridCity">
                                            <Form.Label>City</Form.Label>
                                            <Form.Control  value={userData.city} name="city" onChange={handleOnChange}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>State</Form.Label>
                                            <Form.Control  value={userData.state} name="state" onChange={handleOnChange}>
                                            </Form.Control>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                            <Form.Label>Zip</Form.Label>
                                            <Form.Control value={userData.zipCode} name="zipCode" onChange={handleOnChange}/>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group id="formGridCheckbox">
                                        <Form.Check type="checkbox" label="Check me out" />
                                    </Form.Group>

                                    <Button className="btn-orange" type="button" onClick={saveUserInfo}>
                                        Save
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;


