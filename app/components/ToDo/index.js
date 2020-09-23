import React, { Component } from "react";
import Items from './Items';
import SearchRecipes from './SearchRecipes';
import MyRecipes from './MyRecipes';
import SideNav from './SideNav';
import ToDoTabs from './ToDoTabs';
import { createSocket } from '../../utils/webSocket';

import CreateItem from './CreateItem';
import RecipeDetail from './RecipeDetail';
import MealPlan from './MealPlan';
import Invite from './Invite';
import ToDoStyles from './styles';

import ListService from '../../services/list.service';
import ItemService from '../../services/item.service';

import { NotificationManager } from 'react-notifications';

class ToDo extends Component {

    constructor(props) {
        super(props);
        const userId = props.currentUser ? props.currentUser._id : false

        this.state = {
            currentUser: userId,
            imageBaseUrl: {
                ingredientUrl: 'https://spoonacular.com/cdn/ingredients_100x100/',
                recipeUrl: 'https://spoonacular.com/recipeImages/'
            },
            lists: [],
            items: [],
            currentView: {},
            totalCost: 0,
            receipeDetail: {}
        };
        this._isMounted = false;

        this.socket = createSocket();

        this.socket.on('RECEIVE_CREATE_TASK', function (data, listId) {
            if (listId == getCurrentId()) {
                createTask(data);
            }
            cal()
        });

        this.socket.on('RECEIVE_UPDATE_TASK', function (data, listId) {
            //TODO: notice when the there is only one item on the list and it is deleted, this throws an error
            if (listId == getCurrentId()) {
                updateTask(data);
            }
            cal()
        });

        const cal = () => {
            //this.getListsByUserId();
        }
        const getCurrentId = () => {
            return this.props.match.params.id
        }

        const createTask = data => {
            this.setState({ items: [...this.state.items, data] });

        };

        const updateTask = data => {
            this.setState({ items: data });
        };

    };

    componentDidMount() {
        this._isMounted = true;

        this._isMounted && this.getListsByUserId();
        this._isMounted && this.getItems(this.props.match.params.id);
    };

    componentWillUnmount() {
        this._isMounted = false;
    }

    getUserInfo = async () => {
        const user = await AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: user
            });
        }
    }

    displayErrorMessage = () => {
        NotificationManager.error('Sorry, something went wrong');
    }

    getListsByUserId = async () => {
        try {
            let res = await ListService.getListByUserId(this.state.currentUser);
            this.setState({ lists: res.data });
        } catch (e) {
            if (e.response.data)
                console.log('Error', e.response.data.message);
        }
    };

    setCurrentViewInfo = () => {
        this.props.history.push({
            pathname: `/ToDo/${this.state.currentView._id}/MyList`
        })
        this.getItems(this.state.currentView._id);
    }

    getItems = async id => {
        if (id == undefined || id == "MyList") return;
        try {
            let res = await ItemService.getItemsById(id)
            if (!res.data.lists) {
                if (this.state.lists[0] === undefined) {
                    this.props.history.push({
                        pathname: `/ToDo/MyList`
                    })
                    return
                }
                this.setState({
                    currentView: this.state.lists[0]
                }, () => {
                    this.setCurrentViewInfo()
                })
                return
            }
            this.setState({ currentView: res.data.lists, items: res.data.details });
        } catch (e) {
            if (e.response)
                console.log('Error', e.response);
        }
    };

    calculateTotalCost = () => {
        return this.state.items.reduce(function (a, b) {
            b.price = b.price ? b.price : 0;
            return parseInt(a) + (parseInt(b.price) * parseInt(b.qty));
        }, 0);
    }

    updateItemSocket = () => {
        this.socket.emit('UPDATE_TASK', this.state.items, this.state.currentView._id);
    }

    //START: list actions
    createNewList = async listName => {
        let updateItems = {
            "seq": 0,
            "name": listName,
            "link": listName,
            "userId": this.state.currentUser
        }
        try {
            let res = await ListService.createNewList(updateItems);
            console.log('res', res)
            this.setState({
                currentView: res.data,
                lists: [...this.state.lists, res.data]
            }, () => this.setCurrentViewInfo())
            NotificationManager.success('List added');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    updateList = async list => {
        try {
            await ListService.updateList(list);
            this.setState({
                lists: this.state.lists.map(el => (el._id === list._id ? list : el)),
                currentView: list
            });
            NotificationManager.success('List updated');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    deleteList = async listId => {
        try {
            await ListService.deleteListById(listId);
            this.setState({
                lists: this.state.lists.filter(x => x._id !== listId),
                currentView: 0
            }, () => this.setCurrentViewInfo())
            NotificationManager.success('List deleted');
        } catch (e) {
            this.displayErrorMessage()
        }
    }
    //END: list actions

    //START: item actions
    addItem = async item => {

        if (!item.id || item.id == "") item.original = item.amount + ' ' + item.unitOfMeasure + ' ' + item.name;
        //add list id and createdby to the params
        item.listId = this.state.currentView._id
        item.createdBy = this.state.currentUser

        try {
            let res = await ItemService.addItem(item);
            this.socket.emit('CREATE_TASK', res.data, this.state.currentView._id);
            NotificationManager.success('Item added');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    updateItem = async item => {
        try {
            await ItemService.updateItemById(item);
            this.setState({ items: this.state.items.map(el => (el._id === item._id ? item : el)) }, () => this.updateItemSocket());
            NotificationManager.success('Item updated');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    deleteItem = async itemId => {
        try {
            await ItemService.deleteItemById(itemId);
            this.setState({ items: this.state.items.filter(x => x._id !== itemId) }, () => this.updateItemSocket());
            NotificationManager.success('Item deleted');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    onChangeCheckUnCheckItem = async message => {
        message.completedDate = message.completedDate ? null : new Date();
        try {
            await ItemService.updateCheckOrUncheckItem(message);
            this.setState({ items: this.state.items.map(el => (el._id === message._id ? { ...el, message } : el)) }, () => this.updateItemSocket());
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    onChangeBulkCheckUnCheckItem = async (listId, item, action) => {
        item.completedDate = action == 'Check All' ? new Date() : null;
        try {
            await ItemService.updateBulkCheckOrUncheckItems(listId, item.completedDate);
            this.setState({ items: this.state.items.map(el => (el.listId === listId ? { ...el, completedDate: item.completedDate } : el)) }, () => this.updateItemSocket());
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    deleteBulkItems = async listId => {
        try {
            await ItemService.deleteBulkItemsById(listId);
            this.setState({ items: this.state.items.filter(x => x.listId !== listId) }, () => this.updateItemSocket());
            NotificationManager.success('Successfylly deleted bulk items');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    duplicateItem = async itemId => {
        let duplicatedItem = this.state.items.filter(x => x._id === itemId);
        try {
            let res = await ItemService.duplicateItemOrItem(this.state.currentUser, this.state.currentView._id, duplicatedItem);
            this.setState({ items: this.state.items.concat(res.data) }, () => this.updateItemSocket());
            NotificationManager.success('Successfylly duplicated item');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    duplicateItemGroup = async aisle => {
        let duplicatedItem = this.state.items.filter(x => x.aisle === aisle);

        try {
            let res = await ItemService.duplicateItemOrItem(this.state.currentUser, this.state.currentView._id, duplicatedItem);
            this.setState({ items: this.state.items.concat(res.data) }, () => this.updateItemSocket());
            NotificationManager.success('Successfylly duplicated bulk items');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    deleteBulkGroupItemsByAisle = async (listId, aisleName) => {
        try {
            await ItemService.deleteBulkGroupItemsByAisle(listId, aisleName);
            this.setState({ items: this.state.items.filter(x => x.aisle !== aisleName) }, () => this.updateItemSocket());
            NotificationManager.success('Successfylly deleted group');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    updateBulkGroupItemsByAisle = async (listId, item, action) => {
        item.completedDate = action == 'Check All' ? new Date() : null;

        try {
            await ItemService.updateBulkGroupItemsByAisle(listId, item.aisle, item.completedDate);
            this.setState({ items: this.state.items.map(el => (el.aisle == item.aisle ? { ...el, completedDate: item.completedDate } : el)) }, () => this.updateItemSocket());
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    moveItem = async (itemId, aisleName) => {
        try {
            await ItemService.moveItem(itemId, aisleName);
            this.setState({ items: this.state.items.map(el => (el._id == itemId ? { ...el, aisle: aisleName } : el)) }, () => this.updateItemSocket());
            NotificationManager.success('Successfylly moved item');
        } catch (e) {
            this.displayErrorMessage()
        }
    }

    moveBulkGroupItems = (aisleName) => {
        //TODO: update bulk move
        this.setState({ items: this.state.items.map(el => (el.aisle == aisleName ? { ...el, aisle: aisleName } : el)) }, () => this.updateItemSocket());
    }
    //END: item actions

    render() {
        const { currentView, lists, currentUser, items, imageBaseUrl } = this.state;

        return (
            <>
                <ToDoStyles />
                <div className="container" style={{ paddingTop: "80px", paddingBottom: "60px" }}>

                    <div className="row">
                        <div className="col-lg-3 d-none d-sm-block">
                            <div className="sticky-top sticky-top-card-side shadow">
                                <SideNav
                                    {...this.props}
                                    createNewList={this.createNewList}
                                    updateList={this.updateList}
                                    deleteList={this.deleteList}
                                    getListDetails={this.getItems}
                                    currentUser={currentUser}
                                    lists={lists}
                                />
                            </div>
                        </div>
                        <div className="col-lg-9">

                            {
                                !currentView._id &&
                                <div className="card">
                                    <div className="card-body" style={{ minHeight: "calc(100vh - 142px)", margin: "0 auto"}}>
                                        <h4>Please select a list on the left to view the details</h4>
                                    </div>
                                </div>
                            }

                            {
                                currentView._id &&
                                <div className="card shadow">
                                    <div className="card-header sticky-top sticky-top-card-header">
                                        <h4 className="float-left ">
                                            <span className="text-overflow">{currentView.name}</span>
                                        </h4>

                                        <ul className="nav nav-pills float-right">
                                            <li style={{ marginRight: "2px" }}>
                                                <CreateItem
                                                    action="Add"
                                                    nameOfButton="Add Item"
                                                    currentUserId={currentUser}
                                                    currentView={currentView}
                                                    addItem={this.addItem}
                                                    updateItem={this.updateItem}
                                                    calculateTotalCost={this.calculateTotalCost}
                                                />
                                            </li>
                                            <li><Invite currentUser={this.props.currentUser} currentView={currentView}/> </li>
                                        </ul>

                                    </div>
                                    <div className="card-body no-padding sticky-top sticky-top-card" style={{ zIndex: "999", backgroundColor: "white", bottom: "20px" }}>
                                        <ToDoTabs {...this.props} />
                                    </div>
                                    <div className="card-body" style={{ minHeight: "calc(100vh - 353px)" }}>

                                        {
                                            {
                                                'MyList': <Items
                                                    currentUserId={currentUser}
                                                    currentView={currentView}
                                                    items={items}
                                                    onChangeCheckUnCheckItem={this.onChangeCheckUnCheckItem}
                                                    updateItem={this.updateItem}
                                                    deleteItem={this.deleteItem}
                                                    deleteBulkItems={this.deleteBulkItems}
                                                    duplicateItem={this.duplicateItem}
                                                    onChangeBulkCheckUnCheckItem={this.onChangeBulkCheckUnCheckItem}
                                                    imageBaseUrl={imageBaseUrl}
                                                    duplicateItemGroup={this.duplicateItemGroup}
                                                    deleteBulkGroupItemsByAisle={this.deleteBulkGroupItemsByAisle}
                                                    updateBulkGroupItemsByAisle={this.updateBulkGroupItemsByAisle}
                                                    moveBulkGroupItems={this.moveBulkGroupItems}
                                                    moveItem={this.moveItem}
                                                />,
                                                'Recipes': <SearchRecipes
                                                    currentUserId={currentUser}
                                                    currentView={currentView}
                                                    imageBaseUrl={imageBaseUrl} />,
                                                'MyRecipes': <MyRecipes
                                                    getRecipeById={this.getRecipeById}
                                                    currentUserId={currentUser} />,
                                                'RecipeDetail': <RecipeDetail
                                                    currentUserId={currentUser}
                                                    currentView={currentView}
                                                    imageBaseUrl={imageBaseUrl}
                                                    {...this.props} />,
                                                'MealPlan': <MealPlan
                                                    currentUserId={currentUser}
                                                    currentView={currentView}
                                                    imageBaseUrl={imageBaseUrl}
                                                    {...this.props} />
                                            }[this.props.match.params.tab]
                                        }

                                    </div>
                                    <div className="card-footer">
                                        Projected Cost: {this.calculateTotalCost()}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ToDo;