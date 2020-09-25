import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import Image from 'react-bootstrap/Image';
import Dropdown from 'react-bootstrap/Dropdown';
import { confirmAlert } from 'react-confirm-alert';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import MoveItem from './MoveItem';
import CreateItem from './CreateItem';

const ToDoList = props => {
    const {
        items,
        onChangeCheckUnCheckItem,
        addItem,
        updateItem,
        deleteItem,
        currentUser,
        currentView,
        deleteBulkItems,
        duplicateItem,
        onChangeBulkCheckUnCheckItem,
        duplicateItemGroup,
        deleteBulkGroupItemsByAisle,
        updateBulkGroupItemsByAisle,
        moveBulkGroupItems,
        moveItem
    } = props;

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if(setSearchTerm){
            const listResults = items.filter(item =>
                item.original.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(listResults);
        }else{
            setSearchResults(items);
        }
    }, [searchTerm, items]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    //false = group the items
    //true = ungroup the items
    const [isGroup, setGroup] = useState(true)

    //false = show all items
    //true = Show uncompleted item
    const [isChecked, setChecked] = useState(false)

    const toggleCompleteUncomplete = () => {
        setGroup(isGroup ? false : true)
    }

    //order the group and items
    searchResults.sort(function (a, b) {
        return a.aisle.localeCompare(b.aisle) || a.original.localeCompare(b.original);
    });

    let openItems = 0;
    //group items
    const itemsGrouped = searchResults.reduce((groups, item) => {
        item.aisle = item.aisle == "" || !item.aisle ? "Not Classified" : item.aisle;
        const aisle = (groups[item.aisle] || []);

        //Give me the unchecked items please
        if (isChecked && !item.completedDate) {
            aisle.push(item);
            groups[item.aisle] = aisle;
        }

        //show all of the items please.
        if (!isChecked) {
            aisle.push(item);
            groups[item.aisle] = aisle;
        }

        //i just want to count the completed items. 
        if (item.completedDate) openItems++

        return groups;
    }, {});




    let itemSelectGroupItems = []
    for (var key in itemsGrouped) {
        itemSelectGroupItems.push(key)
    }

    //Customize the dropdown menu button
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
            <i className="fa fa-bars" aria-hidden="true"></i>
        </a>
    ));

    const toggleComplete = () => {
        setChecked(isChecked ? false : true)
    }

    const onClickDeleteItem = item => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You want to delete this item?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteItem(item._id);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    const onClickBulkDeleteItems = () => {
        confirmAlert({
            title: 'Are you sure?',
            message: 'You want to delete all items?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteBulkItems(currentView._id);
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });

    }

    const [modalShow, setModalShow] = React.useState(false);
    const [itemInfo, setModalItemId] = React.useState({});

    const _setModalShow = (params) => {
        setModalShow(true)
        setModalItemId(params)
    }

    const mapGroupMenu = (item) => {
        return (
            <Dropdown drop='right'>
                <Dropdown.Toggle as={CustomToggle} id={`dropdown-custom-components${itemsGrouped[key]}`}></Dropdown.Toggle>
                <Dropdown.Menu className="shadow-1 no-border">
                    <Dropdown.Header>Group Menu</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => updateBulkGroupItemsByAisle(currentView._id, item, 'Check All')}>
                        <i className="fa fa-check" aria-hidden="true"></i> Check all in this group
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => updateBulkGroupItemsByAisle(currentView._id, item, 'Un-Check All')}>
                        <i className="fa fa-circle-o" aria-hidden="true"></i> Un-Check all in this group
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => onChangeBulkCheckUnCheckItem(currentView._id, item, 'Check All')}>
                        <i className="fa fa-check" aria-hidden="true"></i> Check All
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onChangeBulkCheckUnCheckItem(currentView._id, item, 'Un-Check All')}>
                        <i className="fa fa-circle-o" aria-hidden="true"></i> Un-Check All
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => duplicateItemGroup(item.aisle)}>
                        <i className="fa fa-files-o" aria-hidden="true"></i> Duplicate this group
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(ev) => deleteBulkGroupItemsByAisle(item.listId, item.aisle)}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i> Delete this group
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onClickBulkDeleteItems()}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i> Delete All
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const mapItemMenu = (item, index) => {
        return (
            <Dropdown drop='right'>
                <Dropdown.Toggle as={CustomToggle} id={"dropdown-custom-components" + index}></Dropdown.Toggle>
                <Dropdown.Menu className="shadow-1 no-border">
                    <Dropdown.Header>Item Menu</Dropdown.Header>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        <CreateItem
                            list={item}
                            action="Edit"
                            nameOfButton="Edit Item"
                            currentUserId={currentUser}
                            currentView={currentView}
                            addItem={addItem}
                            updateItem={updateItem}
                            deleteItem={deleteItem}
                            typeOfButton="2"
                        >  Edit Item </CreateItem>
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => onChangeBulkCheckUnCheckItem(currentView._id, item, 'Check All')}>
                        <i className="fa fa-check" aria-hidden="true"></i> Check All
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onChangeBulkCheckUnCheckItem(currentView._id, item, 'Un-Check All')}>
                        <i className="fa fa-circle-o" aria-hidden="true"></i> Un-Check All
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => duplicateItem(item._id)}>
                        <i className="fa fa-files-o" aria-hidden="true"></i> Duplicate Item
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={(ev) => onClickDeleteItem(item, ev)}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i> Delete
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onClickBulkDeleteItems()}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i> Delete All
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => _setModalShow({ itemId: item._id, action: "Move Item" })}> Move Item </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        )
    }

    const mapItems = (item, index) => {
        return (
            <tr key={index}>
                <td className="padding-left-25">
                    {mapItemMenu(item, index)}
                </td>
                <td className="width-35">
                    <label className="custom-checkbox">
                        <input type="checkbox" checked={item.completedDate ? true : false} value={item.value} onChange={(e) => onChangeCheckUnCheckItem(item)} />
                        <span className="checkmark"></span>
                    </label>
                </td>
                <td  className={`${item.completedDate ? "line-through-opacity" : ""}`} >
                    {index + 1}
                </td>
                <td  className={`${item.completedDate ? "line-through-opacity" : ""}`} >
                    <Image src={item.image} roundedCircle alt="" className="image" />
                </td>
                <td className={`${item.completedDate ? "line-through" : ""}`} >
                    <span>
                        {item.name}<br />
                        <small className="small-smaller">{item.recipeName}</small>
                    </span>
                </td>
                <td className={` ${item.completedDate ? "line-through" : ""}`} >
                    <span> {item.qty} {item.unitOfMeasure ? ' x ' + item.unitOfMeasure : ""} </span>
                </td>
                <td className={`${item.completedDate ? "line-through" : ""}`} >
                    <span> {item.notes} </span>
                </td>
                {!isGroup && <td className={`${item.completedDate ? "line-through" : ""}`} >
                    <span> {item.aisle ? item.aisle : 'Not Classified'} </span>
                </td>}
                <td className={` ${item.completedDate ? "line-through" : ""}`} style={{ minWidth: "100px" }}>
                    <span>{'$' + item.price}</span>
                </td>
                <td className="width-35">
                    <label className="custom-checkbox">
                        <input type="checkbox" checked={item.completedDate ? true : false} value={item.value} onChange={(e) => onChangeCheckUnCheckItem(item)} />
                        <span className="checkmark"></span>
                    </label>
                </td>
            </tr>
        );
    }

    const setGroupItems = () => {
        let groupItems = [], count = 0;
        for (var key in itemsGrouped) {
            let item = itemsGrouped[key][0]
            var value = itemsGrouped[key];
            groupItems.push(
                <thead key={count++} className="todo-table-thead ">
                    <tr className="sticky-top sticky-top-list">
                        <th colSpan="1" className="padding-left-10">
                            {mapGroupMenu(item)}
                        </th>
                        <th colSpan="10">
                            <span className="text-orange font-size-20"> {key} </span> (total: {value.length})
                        </th>
                    </tr>
                    {value.map((item, index) => mapItems(item, index))}
                </thead>
            )
        }
        return groupItems
    }

    const setUnGroupItems = () => {
        return (<tbody>{searchResults.length > 0 && searchResults.map((item, index) => (mapItems(item, index)))}</tbody>);
    }

    const calculatePercent = () => {
        return !searchResults.length ? 0 + '%' : ((openItems / searchResults.length) * 100).toFixed(2) + '%'
    }

    const getOverall = () => {
        return openItems + '/' + searchResults.length
    }

    return (
        <>
            <div className="row">
                <div className="col-lg-8 col-sm-6 text-left">
                    <h4><i className="fa fa-list"></i> Items <small> ( {getOverall()} ) {calculatePercent()} </small></h4>
                </div>
                <div className="col-lg-4 col-sm-6 text-right">
                    <h4>
                        <i className={"fa fa-object-group pointer" + (isGroup ? ' text-orange ' : '')} aria-hidden="true" onClick={toggleCompleteUncomplete}></i> {" "} {" "}
                        <i className={"fa fa-check-square-o pointer" + (isChecked ? ' text-orange ' : '')} aria-hidden="true" onClick={toggleComplete}></i>
                    </h4>
                </div>
            </div>

            <InputGroup>
                <InputGroup.Prepend>
                    <Button className="btn-orange"> Search </Button>
                </InputGroup.Prepend>
                <FormControl type="search" name="searchList" className="form-control" placeholder="Type to search items" value={searchTerm} onChange={handleChange} autoComplete="off" />
            </InputGroup>
            <hr />

            <div style={{ whiteSpace: "noWrap", overflow: "auto" }}>

                {!searchResults.length && 
                    !searchTerm && 
                    'No items added. Click on the "Add Items" button at the top '
                }
                {searchTerm && 
                    !searchResults.length && 
                    'No results found'
                }
                {isChecked && 
                    searchResults.length > 0 && 
                    openItems == searchResults.length &&
                    <>
                        <h2>'Yay!! No more items!!'</h2>
                        <div style={{ width: "100%", height: "0", paddingBottom: "55%", position: "relative" }}>
                            {/* Just for fun :) */}
                            <iframe src="https://giphy.com/embed/3KC2jD2QcBOSc" width="100%" height="100%" style={{ position: "absolute" }} frameBorder="0" className="giphy-embed"></iframe>
                        </div>
                    </>
                }
                <div style={{ minHeight: "486px" }}>
                    <Table striped hover size="sm" responsive="sm" className="todo-table-items">
                        {isGroup ? setGroupItems() : setUnGroupItems()}
                    </Table>
                </div>
            </div>
            <MoveItem
                show={modalShow}
                onHide={() => setModalShow(false)}
                itemselectgroupitems={itemSelectGroupItems}
                movebulk={moveBulkGroupItems}
                moveitem={moveItem}
                iteminfo={itemInfo}
            />
        </>
    );
}

export default ToDoList;