import React from 'react';
import Nav from 'react-bootstrap/Nav'
import { Link } from 'react-router-dom';

const AdminSideNav = props => {
    return (
        <Nav variant="pills" activeKey="1">
            <Nav.Item>
                <Nav.Link eventKey="1" to="/Admin?tab=AllUsers" as={Link}>All Users</Nav.Link>
            </Nav.Item>
        </Nav>
    );
}

export default AdminSideNav;


