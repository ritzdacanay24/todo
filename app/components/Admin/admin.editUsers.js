import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { confirmAlert } from 'react-confirm-alert';
import UserService from "../../services/user.service";

const AdminEditUsers = ({ userEdit, fetchData }) => {

    const [show, setShow] = useState(false);
    const [userData, setUserData] = useState({});
    const [dataToBeSaved, setDataToBeSaved] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        if (show || userEdit) {
            setUserData(userEdit);
        }
    }, [show, userEdit]);

    const handlerOnChange = (e) => {
        setDataToBeSaved({ ...userData, [e.target.name]: e.target.value });
    }

    const onClickSubmit = async (e) => {
        e.preventDefault();
        await UserService.updateUserInfo(userData._id, dataToBeSaved);
        fetchData();
    }

    const onClickDeleteUser = async (e) => {
        e.preventDefault();

        confirmAlert({
            title: 'Confirm to delete',
            message: `Are you sure you want to delete ${userData.firstName} ${userData.lastName}`,
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        await UserService.deleteUserById(userData._id);
                        fetchData();
                        setShow(false);
                    }
                },
                {
                    label: 'No'
                }
            ]
        });
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Edit
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>User Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="3">
                                Email
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control name="email" defaultValue={userData.email} onChange={handlerOnChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="3">
                                First
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control name="firstName" defaultValue={userData.firstName} onChange={handlerOnChange} />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="formPlaintextEmail">
                            <Form.Label column sm="3">
                                Last
                            </Form.Label>
                            <Col sm="9">
                                <Form.Control name="lastName" defaultValue={userData.lastName} onChange={handlerOnChange} />
                            </Col>
                        </Form.Group>
                    </Form>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Address</Form.Label>
                            <Form.Control name="address" type="text" placeholder="Enter address" defaultValue={userData.address} onChange={handlerOnChange} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>City</Form.Label>
                            <Form.Control name="city" type="text" placeholder="Enter city" defaultValue={userData.city} onChange={handlerOnChange} />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Zip Code</Form.Label>
                            <Form.Control name="zipCode" type="text" placeholder="Enter Zip Code" defaultValue={userData.zipCode} onChange={handlerOnChange} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group id="formGridCheckbox">
                            <Form.Check name="isAdmin" type="checkbox" label="Admin ?" checked={userData.isAdmin ? true : false} value={userData.isAdmin} onChange={handlerOnChange} />
                        </Form.Group>
                    </Form.Row>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={onClickDeleteUser}>
                        Delete User
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={onClickSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AdminEditUsers;


