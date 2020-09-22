import React, { useState, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CreateList = ({ createNewList }) => {

    const [show, setShow] = useState(false);
    const [listName, setListName] = useState("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const onSubmit = e => {
        e.preventDefault();
        createNewList(listName);
        setShow(false)
        setListName("")
    }

    //autofocus when model opens
    const inputRef = useRef(null);
    if (show) {
        setTimeout(() => {
            inputRef.current.focus();
        }, 1);
    }

    const handleOnChange = ev => {
        ev.preventDefault();
        setListName(ev.target.value)
    }

    return (
        <>
            <Button className="btn-orange" onClick={handleShow}> <i className="fa fa-plus" aria-hidden="true"></i> Add List </Button>

            <Modal show={show} onHide={handleClose} centered  backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title> <i className="fa fa-list" aria-hidden="true"></i> New List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group controlId="listName">
                            <Form.Label>List Name</Form.Label>
                            <Form.Control name="name" type="text" ref={inputRef} autoComplete="off" placeholder="Enter list name" className="form-control" onChange={ev => handleOnChange(ev)} />
                            <Form.Text className="text-muted">
                                You can name the list whatever you want
                        </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}> Close </Button>
                    <Button variant="primary" onClick={onSubmit}> Submit </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CreateList;