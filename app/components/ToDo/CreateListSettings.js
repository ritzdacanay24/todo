import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { confirmAlert } from 'react-confirm-alert'; // Import

const CreateListSettings = ({ list, updateList, deleteList }) => {

    const [show, setShow] = useState(false);
    const [values, setValues] = useState({});

    const handleClose = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShow(false)
        setValues({})
    };

    const handleShow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (list) setValues(list)
        setShow(true);
    };

    const submit = e => {
        e.preventDefault();
        e.stopPropagation();
        updateList(values);
        setShow(false)
    }

    const submitDelete = async i => {

        confirmAlert({
            title: 'Are you sure?',
            message: 'You want to delete this list?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteList(values._id)
                        setShow(false);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const handleOnChange = ev => {
        ev.persist();
        setValues(values => ({ ...values, [ev.target.name]: ev.target.value }));
    }

    const handleArchive = () => {
        alert('Under construction')
    }

    return (
        <>
            <i className="fa fa-cog float-right" onClick={handleShow}></i>
            <Modal show={show} onHide={handleClose} centered backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Edit List</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="listName">
                            <Form.Label>List Name</Form.Label>
                            <Form.Control type="text" name="name" autoComplete="off" placeholder="Task name" className="form-control" defaultValue={values.name} onChange={(ev) => handleOnChange(ev)} />
                            <Form.Text className="text-muted"> You can name the list whatever you want </Form.Text>
                        </Form.Group>
                    </Form>

                    <div>
                        Subscribers
                        <ul>
                            {!list.subscribers.length && <li>No subscribers</li>}
                            {list.subscribers.length > 0 && list.subscribers.map((list, index) => {
                                return (
                                    <li key={index}>{list.userId} ({list.isSubscribed ? 'Subscribed' : 'Pending'})</li>
                                )
                            })}
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleArchive}> Archive </Button>
                    <Button variant="secondary" onClick={handleClose}> Close </Button>
                    <Button variant="primary" onClick={submit}> Save Changes </Button>
                    <Button variant="danger" onClick={submitDelete}> Delete </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CreateListSettings;