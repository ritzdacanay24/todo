import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

const NavbarHeader = props => {
    let year = 2020, nameOfApp = 'ToDo';
    return (
        <>
            <Navbar bg="dark" variant="dark" fixed="bottom">
                <Navbar.Text> © {year} {nameOfApp}. All rights reserved </Navbar.Text>
            </Navbar>
        </>
    );
}

export default NavbarHeader;


