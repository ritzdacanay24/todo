import React from 'react';
import { Link } from 'react-router-dom';

const ToDoTabs = ({ match }) => {

    const navLists = [
        {
            name: "My List",
            path: "MyList",
            icon: "fa fa-list"
        }, {
            name: "Recipes",
            path: "Recipes",
            icon: "fa fa-search"
        }, {
            name: "My Recipes",
            path: "MyRecipes",
            icon: "fa fa-heart"
        }, {
            name: "Meal Plan",
            path: "MealPlan",
            icon: "fa fa-file-text-o"
        }
    ];

    const checkActiveTabs = tab => {
        return match.params.tab === tab ? 'active' : '';
    }

    const mapTabs = () => {
        return (
            <div className="bottom-shadow nav-app">
                <ul className="nav nav-pills hideScroll">
                    {navLists.map((tab, index) => {
                        return <Link key={index} className={`nav-link ${checkActiveTabs(tab.path)}`} to={tab.path}><i className={tab.icon}></i> {tab.name}</Link>
                    })}
                </ul>
            </div>
        );
    }
    return (mapTabs());
}

export default ToDoTabs;


