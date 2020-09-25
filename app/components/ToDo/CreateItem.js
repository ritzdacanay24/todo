import React, { useState, useEffect, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ZipCode from './ZipCode';
import InputGroup from 'react-bootstrap/InputGroup';
import { confirmAlert } from 'react-confirm-alert';
import { useDebounce } from '../../utils/debounce';
import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

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
    const [maxCost, setMaxCostThreshold] = useState(2000);

    const timeToCallAPIEndPoint = 3000
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, timeToCallAPIEndPoint);

    //autofocus when model opens
    const inputRef = useRef(null);
    if (show) {
        setTimeout(() => {
            inputRef.current.focus();
        }, 1);
    }

    const fetchData = async function fetchData(e, start = 0) {
        e.preventDefault();
        if(!searchTerm) return;


        let locationInfo = JSON.parse(localStorage.getItem("GroceryToDo"));

        let locationId = locationInfo ? locationInfo.locationId : '70600358'
        setIsSearching(true);

        await repo.KrogerService.isAccessTokenExpired();

        try {

            let res = await repo.KrogerService.searchByItem(searchTerm, locationId, start)
            setIsSearching(false);

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

            setResults(results);
            
            if (results.length) setPagination(res.data.meta.pagination);

        } catch (e) {
            setIsSearching(false);
            console.log(e)
        }
    }


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

    const onClickStageItems = (item) => {

        let acceptedValues = {
            "unitOfMeasure": item.unitOfMeasure
            , "price": item.price
            , "name": item.unitOfMeasure + ' ' + item.description
            , "original": item.description
            , "image": item.image
            , "notes": ""
            , "aisle": item.aisle
            , "amount": item.amount
            , "qty": values.qty ? values.qty : 1
        }

        for (const property in acceptedValues) {
            setValues(values => ({
                ...values
                , [property]: acceptedValues[property]
            }));
        }
        onClickSaveItems(acceptedValues)
    }

    const onClickSaveItems = (item) => {

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

            addItem(item);
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

    const onClickSetPaginationStart = (e, type) => {
        if (type == 'back') {
            let start = paginationStart - 50;
            if (pagination.start == 0) {
                return
            } else {
                setPaginationStart(start);
                fetchData(e, start)
            }
        } else {
            
            let start = paginationStart + 50;
            if (pagination.start == pagination.total) {
                return
            } else if((start) >= pagination.total){
                return
            }else{
                setPaginationStart(start);
                fetchData(e, start)
            }
        }

    }

    return (
        <>

            {!typeOfButton && <Button className="btn-orange float-right" onClick={handleShow}> <i className={icon} aria-hidden="true"></i> {nameOfButton} </Button>}
            {typeOfButton == 2 && <span onClick={handleShow}> Edit Item </span>}

            <Modal size={typeOfButton == 2 ? 'lg' : 'xlg'} show={show} onHide={handleClose} centered className={typeOfButton == 2 ? '' : results.length > 0 ? "modal-container custom-map-modal" : ""}>
                <Modal.Header closeButton>
                    <Form autoComplete="off" onSubmit={fetchData}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1" className="btn-orange pointer" onClick={fetchData}> <i className="fa fa-search" aria-hidden="true"></i></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control ref={typeOfButton == 2 ? null : inputRef} name="searchTerm" type="search" placeholder="Search item" onChange={e => setSearchTerm(e.target.value)} />
                        </InputGroup>
                    </Form> &nbsp;
                    <ZipCode />
                </Modal.Header>
                <Modal.Body style={{ 'maxHeight': 'calc(100vh - 210px)', 'overflowY': 'auto' }}>
                    {isSearching && <div> Searching ... </div>}
                    {searchTerm &&
                        <div className="row">
                            {results.length > 0 &&
                                results.map((item, index) => (
                                    <div key={index} className={typeOfButton == 2 ? "col-lg-4" : "col-xl-2 col-lg-3 col-md-4 col-sm-6"}>
                                        <Card border="warning" style={{ fontSize: "12px", maxHeight: "400px", minHeight: "400px", marginBottom: "10px" }} className="shadow">
                                            <span style={{ padding: "5px", margin: "0 auto" }}>
                                                <Card.Img variant="top" src={item.image} style={{ width: "120px", height: "140px", objectFit: "scale-down" }} /></span>
                                            <Card.Body style={{ lineHeight: "2px" }} className="d-flex flex-column">
                                                <h6><strong>{item.description}</strong></h6>
                                                <p>Price: ( {item.price} ) Promo: {item.promo}</p>
                                                <p>In Store:  {" "}
                                                    {item.fulfillment.inStore ?
                                                        <span className="badge badge-pill badge-success">YES</span> :
                                                        <span className="badge badge-pill badge-danger">NO</span>
                                                    }
                                                </p>
                                                <button className="btn-orange mt-auto btn btn-block" onClick={(ev) => onClickStageItems(item)}>Add</button>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))}
                        </div>
                    }

                    {typeOfButton == 2 &&
                        <>
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
                        </>
                    }
                </Modal.Body>
                <Modal.Footer>

                    {results.length > 0 &&
                        <div className="pull-left mr-auto">
                            <span onClick={(e) => onClickSetPaginationStart(e, 'back')} className="pointer"><i className="fa fa-angle-double-left" aria-hidden="true"></i> Left {paginationStart} </span> {' '} | {' '}
                            <span onClick={(e) => onClickSetPaginationStart(e, 'foward')} className="pointer">Right <i className="fa fa-angle-double-right" aria-hidden="true"></i> {paginationStart + 50}</span> {' '}
                            Total: {pagination.total}
                        </div>
                    }

                    <Button variant="secondary" onClick={handleClose}> Close </Button>
                    {
                        {
                            'Edit':
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