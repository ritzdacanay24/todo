import Axios from 'axios';
import queryString from 'query-string'; 
import Jumbotron from 'react-bootstrap/Jumbotron';
import React, { useState, useEffect } from 'react';

const InviteRequests = props => {
    let params = queryString.parse(props.location.search);
    const [message, setMessage] = useState()

    const getSub = async () => {
        try {
            let res = await Axios.put(`http://localhost:5000/api/lists/subscribers/${params.listId}/${params.toUser}`);
            props.location.search = {}
            setMessage(res.data.message)
        } catch (e) {
            if(e.response)
            props.location.search = {}
            setMessage(e.response.data)
        }
    }

    useEffect(() => {
        if (params.listId && params.toUser) getSub()
    }, []); 

    return (
        <Jumbotron>
            <h1>Subscribed</h1>
            <p> {message} </p>
        </Jumbotron>
    );
}

export default InviteRequests;


