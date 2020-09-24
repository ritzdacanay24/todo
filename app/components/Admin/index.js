import React, { useEffect } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdminSideNav from './admin.sideNav';
import AdminUsers from "./admin.users";

const Admin = props => {

    useEffect(() => {
        if (props.currentUser && !props.currentUser.isAdmin) props.history.push('/');
    }, []);

    return (
        <Jumbotron>
            <Container>
                <Row>
                    <Col><AdminSideNav /></Col>
                </Row>
                <Row>
                    <Col><AdminUsers /></Col>
                </Row>
            </Container>
        </Jumbotron>
    );
}
export default Admin;


