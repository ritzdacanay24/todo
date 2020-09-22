import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const MoveItem = props => {

    const [aisleName, setAisleName] = useState("")

    const handleChange = (e) => {
        setAisleName(e.target.value);
        if (props.iteminfo.action == 'Move Item') {
            props.moveitem(props.iteminfo.itemId, e.target.value)
        } else if (props.iteminfo.action == 'Bulk Move Item') {
            props.movebulk(e.target.value);
        }
        props.onHide();
    }

    return (

        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Move item
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Label>Select group you want this item moved to</Form.Label>
                        <Form.Control as="select" onChange={handleChange} custom>
                            <option> Select Group </option>
                            {props.itemselectgroupitems && props.itemselectgroupitems.map((item, index) => (
                                <option key={index} value={item}> {item}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal >
    );
}

export default MoveItem;

