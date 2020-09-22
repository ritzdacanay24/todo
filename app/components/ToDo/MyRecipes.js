import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

import RecipeService from '../../services/recipe.service';

class MyRecipes extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            details: [],
            isShowingDetails: false,
            currentUserId: props.currentUserId
        }
    }

    componentDidMount() {
        this.mounted = true;
        this.getRecipes();
    };

    componentWillUnmount() {
        this.mounted = false;
    };

    getRecipes = async () => {
        try {
            let res = await RecipeService.getRecipeByUserId(this.state.currentUserId);
            if (this.mounted) this.setState({ details: res.data });
        } catch (e) {
            console.log(e)
        }
    }

    handleOnChange = ev => {
        this.setState({ [ev.target.name]: ev.target.value });
    }

    viewDetails = id => {
        this.setState({ isShowingDetails: this.state.details.find(x => x._id === id) });
    }

    messageLengthToDisplay = (item, maxCount = 100) => {
        return (
            item.recipe.instructions && item.recipe.instructions.length > maxCount ?
                (
                    <span> {`${item.recipe.instructions.substring(0, maxCount)}...`} </span>
                ) :
                <span>{item.recipe.instructions}</span>
        )
    }

    mapRecipes = () => {
        return this.state.details.map((item, index) => {
            return (
                <div className="col-xl-6 col-lg-6 col-md-6 col-md-6" key={index}>
                    <Card>
                        <Card.Img variant="top" src={item.image} style={{ maxHeight: "250px", minHeight: "200px" }} />
                        <Card.Body>
                            <Card.Title>{item.title}</Card.Title>
                            <Card.Text> Mins. {item.recipe.cookingMinutes} </Card.Text>
                            <Card.Text> {this.messageLengthToDisplay(item)} </Card.Text>
                            <Link key={index} to={`RecipeDetail?recipeId=${item._id}`}>
                                <Button className="btn-orange">View</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <br />
                </div>
            )
        });
    }

    render() {
        return (
            <div>
                <h3><i className="fa fa-heart"></i> My Recipes</h3>
                <hr />
                <div className="row">
                    {this.mapRecipes()}
                </div>
                <div className="row">
                    {!this.state.details.length && " You have no saved recipes."}
                </div>
            </div>
        );
    }
}


export default MyRecipes;