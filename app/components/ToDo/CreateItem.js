import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { confirmAlert } from 'react-confirm-alert';
import { useDebounce } from '../../utils/debounce';
import KrogerService from "../../services/kroger.service";

const CreateItem = ({ action, list, addItem, updateItem, deleteItem, nameOfButton, typeOfButton, calculateTotalCost }) => {

    const icon = action == 'Add' ? 'fa fa-plus' : 'fa fa-pencil-square-o';

    let itemDefaultValues = {
        "unitOfMeasure": "",
        "price": 0,
        "name": "",
        "image": "",
        "notes": "",
        "qty": 1,
        "aisle": "",
        "amount": 0
    }

    const [show, setShow] = useState(false);
    const [isClose, setIsClose] = useState(false);

    const [values, setValues] = useState(itemDefaultValues);
    const [results, setResults] = useState([]);
    const [pagination, setPagination] = useState(0);
    const [paginationStart, setPaginationStart] = useState(0);
    const [maxCost, setMaxCostThreshold] = useState(500);

    const timeToCallAPIEndPoint = 3000
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, timeToCallAPIEndPoint);

    //autofocus when model opens
    const inputRef = useRef(null);
    if (show) {
        // setTimeout(() => {
        //     inputRef.current.focus();
        // }, 1);
    }

    useEffect(

        () => {
            let isSubscribed = true
            if (debouncedSearchTerm && searchTerm && isSubscribed) {

                setIsSearching(true);

                //TODO: add input to capture the zipcode and get the id from the endpoint
                let locationId = '70600358'

                const fetchData = async function fetchData() {

                    await KrogerService.isAccessTokenExpired();

                    try {
                        let res = await KrogerService.searchByItem(debouncedSearchTerm, locationId, paginationStart)

                        let results = res.data.data;

                        // looping through data to place them in the parent 
                        // this is because this api end point has many arrays. 
                        for (let i = 0; i < results.length; i++) {
                            //set image to paremt
                            results[i].image = "";
                            results[i].price = 0;
                            results[i].promo = 0;
                            results[i].unitOfMeasure = "";
                            results[i].aisle = results[i].categories.toString();
                            results[i].fulfillment = {};

                            //loop through images to get a specific image
                            for (let ii = 0; ii < results[i].images.length; ii++) {
                                if (results[i].images[ii].featured) {
                                    for (let iii = 0; iii < results[i].images[ii].sizes.length; iii++) {
                                        if (results[i].images[ii].sizes[iii].size == 'large') {
                                            results[i].image = results[i].images[ii].sizes[iii].url
                                        }
                                    }
                                }
                            }

                            //get price
                            for (let ii = 0; ii < results[i].items.length; ii++) {
                                results[i].price = results[i].items[ii].price ? results[i].items[ii].price.regular : 0
                                results[i].promo = results[i].items[ii].price ? results[i].items[ii].price.promo : 0
                                results[i].unitOfMeasure = results[i].items[ii].size
                                results[i].fulfillment = results[i].items[ii].fulfillment
                            }
                        }

                        setPagination(res.data.meta.pagination);
                        setIsSearching(false);
                        setResults(results);

                    } catch (e) {
                        console.log(e)
                    }
                }
                fetchData();


            } else {
                setResults([]);
            }

            return () => isSubscribed = false

        },
        [debouncedSearchTerm, paginationStart]
    );

    const reset = () => {
        setPaginationStart(0)
        setPagination(0)
        setResults([])
        setValues([])
        setSearchTerm(false)
    }

    const handleClose = () => {
        setShow(false)
        reset()
    };

    const handleShow = () => {
        //if action id edit, get the values and store them in the input
        if (action === 'Edit') setValues(list);
        setShow(true)
    };

    const onClickSaveItems = ev => {
        ev.preventDefault();
        if (calculateTotalCost() + values.price > maxCost) {
            confirmAlert({
                title: 'Sorry, you have reached the maximum amount.',
                message: '',
                buttons: [
                    {
                        label: 'Ok',
                        onClick: () => { return }
                    }
                ]
            });
        } else {

            addItem(values, ev);
            setShow(!isClose)
        }

    }

    const handleOnChange = ev => {
        ev.persist();
        setValues(values => ({ ...values, [ev.target.name]: ev.target.value }));
    }

    const handleOnChangeOnClose = ev => {
        setIsClose(ev.target.value);
    }

    const onClickUpdateItem = ev => {
        ev.preventDefault();
        updateItem(values, ev);
        setShow(false)
    }

    const onClickDeleteItem = ev => {
        ev.preventDefault();
        deleteItem(list._id, ev);
        setShow(false)
    }

    const onClickStageItems = (item) => {

        let acceptedValues = {
            "unitOfMeasure": item.unitOfMeasure
            , "price": item.price
            , "name": item.description
            , "image": item.image
            , "notes": ""
            , "aisle": item.aisle
            , "amount": item.amount
            , "qty": values.qty
        }

        for (const property in acceptedValues) {
            setValues(values => ({
                ...values
                , [property]: acceptedValues[property]
            }));
        }
    }

    return (
        <>

            {!typeOfButton && <Button className="btn-orange float-right" onClick={handleShow}> <i className={icon} aria-hidden="true"></i> {nameOfButton} </Button>}
            {typeOfButton == 2 && <span onClick={handleShow}> Edit Item </span>}

            <Modal size="lg" show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title><i className={icon} aria-hidden="true"></i> {action} Item </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="off">
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Search Item
                                </Form.Label>
                                <Col>
                                    <Form.Control ref={inputRef} name="searchTerm" type="text" placeholder="Search item" defaultValue={values.searchTerm || ""} onChange={e => setSearchTerm(e.target.value)} />
                                    <small>After typing, a list of matched items will be displayed below.</small>
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        {searchTerm &&
                            <Form.Group>
                                <Form.Row>
                                    <Col>

                                        <div style={{ maxHeight: "400px", overflow: "auto", fontSize: "14px" }}>
                                            {isSearching && <div>Searching ...</div>}

                                            {results.length > 0 &&
                                                results.map((item, index) => (
                                                    <div className="media border p-3" key={index}>
                                                        <img src={item.image} alt="John Doe" className="align-self-center mr-3" style={{ width: "150px", maxHeight: "200px" }} />

                                                        <div className="media-body">
                                                            <h6>Description: <strong>{item.description}</strong></h6>
                                                            <p>Brand {item.brand}</p>
                                                            <p>Price: ( {item.price} ) Promo: {item.promo}</p>
                                                            <p>In Store:  {" "}
                                                                {item.fulfillment.inStore ?
                                                                    <span className="badge badge-pill badge-success">YES</span> :
                                                                    <span className="badge badge-pill badge-danger">NO</span>
                                                                }
                                                            </p>
                                                            <Button className="btn-orange btn-sm" onClick={() => onClickStageItems(item)}><i className="fa fa-plus"></i> </Button> {" "}

                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </Col>
                                </Form.Row>
                            </Form.Group>
                        }

                        <hr />

                        <span onClick={() => setPaginationStart(paginationStart - 50)}>Left {pagination.start} </span> {" "}
                        <span onClick={() => setPaginationStart(paginationStart + 50)}>Right {pagination.start + 50}</span> {" "}

                        total: {pagination.total}

                        <hr />

                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Item Name
                                </Form.Label>
                                <Col>
                                    <Form.Control name="name" type="text" placeholder="Item name" value={values.name || ""} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Quantity
                                </Form.Label>
                                <Col>
                                    <Form.Control name="qty" type="number" placeholder="Quantity" value={values.qty || 0} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Amount
                                </Form.Label>
                                <Col>
                                    <Form.Control name="amount" type="text" placeholder="amount" value={values.amount || ""} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    UOM
                                </Form.Label>
                                <Col>
                                    <Form.Control name="unitOfMeasure" type="text" placeholder="ex: gal" value={values.unitOfMeasure || ""} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Aisle
                                </Form.Label>
                                <Col>
                                    <Form.Control name="aisle" type="text" placeholder="aisle" value={values.aisle || ""} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Price
                                </Form.Label>
                                <Col>
                                    <Form.Control name="price" type="text" placeholder="Price" value={values.price || 0} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Total price
                                </Form.Label>
                                <Col>
                                    <Form.Control readOnly name="price" type="text" placeholder="Price" value={values.qty * values.price || 0} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                        <Form.Group>
                            <Form.Row>
                                <Form.Label column lg={2}>
                                    Notes
                                </Form.Label>
                                <Col>
                                    <Form.Control name="notes" type="text" placeholder="Notes" value={values.notes || ""} onChange={ev => handleOnChange(ev)} />
                                </Col>
                            </Form.Row>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Form.Group >
                        <Col sm={{ span: 0, offset: 0 }}>
                            <Form.Check label="Close on submit" name="closeOnClick" onChange={ev => handleOnChangeOnClose(ev)} />
                        </Col>
                    </Form.Group>
                    <Button variant="secondary" onClick={handleClose}> Close </Button>
                    {
                        {
                            'Add': <Button variant="primary" onClick={onClickSaveItems}> Add Item </Button>
                            , 'Edit':
                                <>
                                    <Button variant="primary" onClick={onClickUpdateItem}> Update Item </Button>
                                    <Button variant="danger" onClick={onClickDeleteItem}> Delete Item </Button>
                                </>
                        }[action]
                    }
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default CreateItem;