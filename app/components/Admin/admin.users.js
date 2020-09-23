import React, { useEffect, useState } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Table from 'react-bootstrap/Table';
import AdminEditUsers from './admin.editUsers';
import UserService from "../../services/user.service";

const AdminUsers = props => {

    const [data, setData] = useState([]);

    const fetchData = async function fetchData() {
        const result = await UserService.getAll();
        setData(result.data);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const mapTable = () => {
        return data.map((user, index) => {
            return (
                <tr key={index}>
                    <td>{user._id}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.avitar}</td>
                    <td>{user.isAdmin ? 'Yes' : ''}</td>
                    <td>{user.state}</td>
                    <td><AdminEditUsers userEdit={user} fetchData={fetchData}/></td>
                </tr>
            )
        })
    }

    return (
        <>
            <h1>Memebers</h1>
            <Table striped bordered hover responsive style={{whiteSpace:"nowrap"}}>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Avitar</th>
                        <th>Admin</th>
                        <th>State</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {mapTable()}
                </tbody>
            </Table>
        </>
    );
}

export default AdminUsers;


