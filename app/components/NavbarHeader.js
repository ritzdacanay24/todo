import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import check from '../images/check.png';
import { Link } from 'react-router-dom';

import AuthService from "../services/auth.service";
import KrogerService from "../services/kroger.service";

const NavbarHeader = ({ userInfo }) => {
    const logOut = () => {
        KrogerService.deleteTokens()
        AuthService.logout();
        window.location.href = '/Login'
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top" className="todo-header-logo">
            <Navbar.Brand  as={Link} to="/">
                <span className="position-relative">GROCERY TOD<img src={check} /></span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link></Nav.Link>
                    <Nav.Link></Nav.Link>
                    <Nav.Link as={Link} to="/features">Features</Nav.Link>
                    <Nav.Link as={Link} to="/ToDo">ToDo</Nav.Link>
                    <Nav.Link as={Link} to="/pricing">Pricing</Nav.Link>
                    {userInfo && userInfo.isAdmin && <Nav.Link as={Link} to="/Admin">Admin</Nav.Link>}
                </Nav>
                <Nav>
                    {userInfo ? (
                        <>
                            <Nav className="mr-auto" style={{ float: "left" }}>
                                <NavDropdown title="Profile" id="collasible-nav-dropdown">
                                    <NavDropdown.Item onClick={logOut}>Log Out</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            <Navbar.Collapse className="justify-content-end">
                                <Navbar.Text>
                                    Signed in as: <a href="true">{userInfo.firstName} {userInfo.lastName}</a>
                                </Navbar.Text>
                            </Navbar.Collapse>
                        </>
                    ) :
                        <Nav.Link as={Link} to="/Login"> Login </Nav.Link>
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarHeader;


