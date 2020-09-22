import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import CreateList from './CreateList';
import CreateListSettings from './CreateListSettings';
import logo from '../../images/groceryTodo-1.png';

const SideNav = ({ match, lists, getListDetails, createNewList, updateList, deleteList }) => {
    const currentTab = match.params.tab == undefined ? 'MyList' : match.params.tab;

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const listResults = lists.filter(list =>
            list.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(listResults);
    }, [searchTerm, lists]);

    const onClickGetReulsts = (listId) => {
        getListDetails(listId);
        setSearchTerm("")
    }

    const myList = () => {
        return (
            <article className="card-group-item">
                <div className="filter-content">
                    {!searchResults.length &&
                        <li className="list-group list-group-flush list-group-item">
                            No Results found!
                        </li>
                    }
                    {searchResults && 
                        searchResults.map((list, index) => {
                        return (
                            <Link to={'/ToDo/' + list._id + '/' + currentTab} key={index}>
                                <li onClick={() => onClickGetReulsts(list._id)} className={"list-group list-group-flush list-group-item " + (match.params.id == list._id ? 'active sticky-top sticky-top-list' : '')}>
                                    <i className="fa fa-th-list"></i> {list.name}
                                    {searchResults.length > 1 && <CreateListSettings updateList={updateList} list={list} deleteList={deleteList} />}
                                </li>
                            </Link>
                        )
                    })}

                </div>
            </article>
        );
    }
    return (
        <>
            <div className="card todo-side-nav">
                <div className="card-header sticky-top sticky-top-card-header card-header-side bottom-shadow" >
                    <Image src={logo} className="text-center" />
                    <input
                        type="search"
                        name="searchList"
                        className="form-control sticky-top sticky-top-search"
                        placeholder="Type to search list"
                        value={searchTerm}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>
                <div className="card-body no-padding no-border side-body">
                    {myList()}
                </div>
                <div className="card-footer">
                    <CreateList createNewList={createNewList} />
                </div>
            </div>
        </>
    );
}

export default SideNav;


