import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

import { NotificationManager } from 'react-notifications';

const ContactUs = props => {

    const [userData, setUserData] = useState({});

    const handleOnChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }

    const save = async (e) => {
        e.preventDefault();
        await repo.SupportService.createSupportTicket(userData);
        NotificationManager.success('Your ticket is submitted. Thank you!!');
    }

    return (
        <div className="contactUs">
            <Container>
                <Row>
                    <Col>
                        <Card className="shadow" style={{ border: "none" }}>
                            <Card.Body>
                                <Card.Title>Contact us!</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">Send us an email. We will get back to within 24 hours.</Card.Subtitle>
                                <Form>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control type="text" placeholder="I love grocery todo" name="fullName" onChange={handleOnChange} />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlInput1">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" placeholder="name@example.com" name="email" onChange={handleOnChange} />
                                    </Form.Group>
                                    <Form.Group controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control as="textarea" rows="8" name="comment" onChange={handleOnChange} />
                                    </Form.Group>
                                </Form>
                                <Card.Link href="" onClick={save}>Submit</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
export default ContactUs;


