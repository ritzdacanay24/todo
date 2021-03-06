
import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Jumbotron from 'react-bootstrap/Jumbotron';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

const InviteRequests = props => {
    let params = queryString.parse(props.location.search);
    const [message, setMessage] = useState()

    const getSub = async () => {
        try {
            let res = await repo.ListService.saveSubscribers(params.listId, params.toUser);
            setMessage(res.data.message)
        } catch (e) {
            if (e.response) {
                setMessage(e.response.data)
            }
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


