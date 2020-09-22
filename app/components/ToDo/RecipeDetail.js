import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import queryString from 'query-string'

import RecipeService from '../../services/recipe.service';
import ItemService from '../../services/item.service';

export default class RecipeDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            main: {},
            details: [],
            recipeId: queryString.parse(this.props.location.search).recipeId,
            baseImagePath: 'https://spoonacular.com/cdn/ingredients_100x100'
        }
    }

    componentDidMount() {
        this.getRecipeById(this.state.recipeId)
    }

    getRecipeById = async recipeId => {
        try {
            let res = await RecipeService.getRecipeById(recipeId);
            this.setState({ details: res.data })
        } catch (e) {
            console.log(e)
        }
    }

    onClickAddItemsToList = async () => {
        const { baseImagePath, details } = this.state;
        const { currentUserId, currentView } = this.props;

        details.ingredients.forEach(function (e) {
            e.notes = "";
            e.seq = 0;
            e.qty = 1;
            e.unitOfMeasure = e.unit;
            e.image = e.image.includes("http") ? e.image : `${baseImagePath}/${e.image}`;
            e.recipeId = details.id;
            e.ingredientId = e.id;
            e.recipeName = details.title;
            e.price = (details.pricePerServing / details.ingredients.length).toFixed(2);
        });

        try {
            await ItemService.addBulkItems(currentUserId, currentView._id, details.ingredients)
        } catch (e) {
            console.log(e)
        }
    }

    onClickDeleteRecipe = async () => {
        try {
            await ItemService.deleteRecipeById(this.state.recipeId);
            this.props.history.push({ pathname: `/ToDo/${this.props.match.params.id}/MyRecipes` })
        } catch (e) {
            console.log(e)
        }
    }

    mapSteps = () => {
        return (
            this.state.details.steps &&
            this.state.details.steps.length > 0 &&
            this.state.details.steps.map((item, index) => (
                <li key={index}> <input type="checkbox" /> {item.number} {" "} {item.step} </li>
            ))
        )
    }

    mapIngredient = () => {
        return (
            this.state.details.ingredients.length &&
            this.state.details.ingredients.map((item, index) => (
                <ListGroup.Item key={index}>
                    <label className="custom-checkbox float-right">
                        <input type="checkbox" />
                        <span className="checkmark" style={{ top: "0" }}></span>
                    </label>
                    <Image style={{ maxHeight: "40px", minWidth: "40px" }} src={`${this.props.imageBaseUrl.ingredientUrl}${item.image}`} rounded />
                    <span className="float-right">{item.amount} {' '} {item.name}</span>
                </ListGroup.Item>
            ))
        )
    }

    render() {

        const { details } = this.state;

        return (
            <>
                <div>
                    <h3><i className="fa fa-file-text"></i> Recipe Details</h3>
                    <hr />
                </div>

                {details.title &&
                    <div>
                        <Card className="no-border recipe-details">
                            <Card.Body>
                                <Card.Img className="img-fluid" variant="right" src={details.image} />
                                <Card.Title>{details.title}</Card.Title>

                                <Card.Title>  Price Per Serving: </Card.Title>
                                <Card.Text> $ {details.pricePerServing} </Card.Text>

                                <Card.Title> Cooking Time: </Card.Title>
                                <Card.Text> {details.cookTime} </Card.Text>

                                <Card.Title> Serving: </Card.Title>
                                <Card.Text> {details.servings} </Card.Text>

                                <Card.Title> Instructions: </Card.Title>
                                <Card.Text> {details.instructions} </Card.Text>

                                <Card.Title> Steps: </Card.Title>
                                <ul> {this.mapSteps()} </ul>

                                <Card.Title> Ingredients: </Card.Title>
                                <ListGroup> {this.mapIngredient()} </ListGroup>

                            </Card.Body>
                            <Card.Footer>
                                <Button className="btn-danger float-right" onClick={ev => this.onClickDeleteRecipe(ev)}>
                                    <i className="fa fa-trash-o"></i> Delete Recipe
                                </Button>
                                <Button className="btn-orange" onClick={ev => this.onClickAddItemsToList(ev)}>
                                    <i className="fa fa-plus"></i> Add All items to list
                                </Button>
                            </Card.Footer>
                        </Card>
                    </div>
                }
            </>
        );
    }
}
