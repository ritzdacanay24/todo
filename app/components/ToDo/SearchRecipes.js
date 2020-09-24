import React, { Component } from "react";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Image from 'react-bootstrap/Image';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';

import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

import { NotificationManager } from 'react-notifications';

class SearchRecipes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      recipe: "",
      searchBy: "Search by recipe name",
      details: {
        extendedIngredients: []
      },
      recipeList: [],
      startFrom: 0,
      limit: 50,
      totalResults: 0,
      criteria: [
        'Search By Website link',
        'Search by recipe name'
      ]
    }
  }

  isUrl = async (s) => {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }

  searchRecipe = async e => {
    e.preventDefault();

    switch (this.state.searchBy) {
      case 'Search By Website link':
        if (!this.isUrl(this.state.recipe)) {
          alert("Not a valid website link")
          return
        }
        try {
          const res = await repo.SpoonacularService.extractRecipeFromUrl(this.state.recipe);
          console.log(res)
          this.setState({ details: res.data, recipeList: [] });
        } catch (e) {
          console.log(e)
        }
        break;
      case 'Search by recipe name':
        try {
          const res = await repo.SpoonacularService.searchByRecipeName(this.state.recipe, this.state.startFrom, this.state.limit);
          if (!res.data.results.length) {
            alert('No recipe found with that name')
            return
          }
          this.setState({ recipeList: res.data.results, limit: res.data.number, startFrom: res.data.offset, totalResults: res.data.totalResults });
        } catch (e) {
          console.log(e)
        }
        break;
    }
  }

  viewRecipeDetailsById = async recipeId => {
    try {
      const res = await repo.SpoonacularService.getRecipeInfoById(recipeId);
      this.setState({ details: res.data });
    } catch (e) {
      console.log(e)
    }
  }

  handleOnChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  saveRecipe = async () => {
    const { details } = this.state;

    let params = {
      title: details.title,
      summary: details.summary,
      ingredients: details.ingredients,
      steps: details.steps,
      rating: details.rating,
      notes: "",
      source: details.source,
      servings: details.servings,
      prepTime: details.prepTime,
      cookTime: details.cookTime,
      readyInMinutes: details.readyInMinutes,
      veryPopular: details.veryPopular,
      image: details.image,
      pricePerServing: details.pricePerServing,
      instructions: details.instructions,
      recipe: details.recipe,
      id: details.id,
      userId: this.props.currentUserId
    }

    try {

      await repo.RecipeService.addRecipeAction(params);
      NotificationManager.success('Receipe saved');
    } catch (e) {
      console.log(e)
    }
  }

  setSingleState = (data) => {
    this.setState(data)
  }

  getSteps = () => {
    return (
      this.state.details.steps && this.state.details.steps.length > 0 && this.state.details.steps.map((item, index) => (
        <li key={index}> {item.number} {" "} {item.step} </li>
      ))
    )
  }

  listIngredient = () => {
    return (
      this.state.details.ingredients.length && this.state.details.ingredients.map((item, index) => (
        <ListGroup.Item key={index}>
          <Image className="img-fluid" style={{ maxHeight: "40px", minWidth: "40px" }} src={`${this.props.imageBaseUrl.ingredientUrl}${item.image}`} rounded />
          <span className="float-right">{item.amount.toFixed(0)} {' '} {item.name}</span>
        </ListGroup.Item>
      ))
    )
  }
  mapRecipeList = () => {
    return (
      this.state.recipeList.map((item, index) => (
        <ListGroup.Item key={index}>
          <Form.Row>
            <Col>
              <Image src={`${this.props.imageBaseUrl.recipeUrl}${item.image}`} thumbnail style={{ maxWidth: "100px" }} alt="No image" /></Col>
            <Col>
              Title: {item.title} <br />
                Serving: {item.servings} <br />
                Time: {item.readyInMinutes} <br />
              <Button className="btn-orange" onClick={() => this.viewRecipeDetailsById(item.id)}>View Details</Button>
            </Col>
          </Form.Row>
        </ListGroup.Item>
      ))
    )
  }

  mapSearchCriteria = () => {
    return this.state.criteria.map((item, index) => <Dropdown.Item key={index} onClick={() => this.setSingleState({ searchBy: item })}>{item}</Dropdown.Item>)
  }

  render() {
    return (
      <>
        <div>
          <h3><i className="fa fa-search"></i> Search Recipes</h3>
          <hr />
        </div>

        <Form onSubmit={this.searchRecipe}>
          <InputGroup>
            <InputGroup.Prepend>
              <Button className="btn-orange" onClick={ev => this.searchRecipe(ev)}>Search </Button>
            </InputGroup.Prepend>
            <FormControl type="search" name="recipe" autoComplete="off" autoFocus placeholder={this.state.searchBy} className="form-control" value={this.state.recipe} onChange={ev => this.handleOnChange(ev)} />
            <DropdownButton variant="outline-primary" title={this.state.searchBy} id="input-group-dropdown-2" >
              {this.mapSearchCriteria()}
            </DropdownButton>
          </InputGroup>
        </Form>

        <br></br>
        <p>To get started, select the type of search on the right hand side. You can search by entering the recipe website or by searching any recipes. </p>

        {this.state.recipeList.length > 0 &&
          <Form.Group>
            <Form.Row>
              <Col>
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <ListGroup> {this.mapRecipeList()} </ListGroup>
                </div>
              </Col>
            </Form.Row>
          </Form.Group>
        }

        {this.state.details.title &&
          <div>
            <div>
              <h3><i className="fa fa-info" aria-hidden="true"></i> Recipe Details</h3>
              <hr />
            </div>
            <Card className="no-border">
              <Card.Body>
                <Card.Img className="img-fluid" variant="right" src={this.state.details.image} style={{ maxHeight: "400px", width: "400px" }} />
                <Card.Title>{this.state.details.title}</Card.Title>

                <Card.Title> Summary: </Card.Title>
                <Card.Text dangerouslySetInnerHTML={{__html: this.state.details.summary}} />

                <Card.Title> Cooking Time: </Card.Title>
                <Card.Text> {this.state.details.cookTime || 'N/A'} </Card.Text>

                <Card.Title> Serving: </Card.Title>
                <Card.Text> {this.state.details.servings} </Card.Text>

                <Card.Title> Instructions: </Card.Title>
                <Card.Text> {this.state.details.instructions|| 'No Instructions Added'} </Card.Text>

                <Card.Title> Steps: </Card.Title>
                <ul> {this.getSteps() || 'No Steps Added'} </ul>

                <Card.Title> Ingredients: </Card.Title>
                <ListGroup> {this.listIngredient()} </ListGroup>

              </Card.Body>
              <Card.Footer>
                <Button className="btn-orange" onClick={ev => this.saveRecipe(ev)}> Save recipe </Button>
              </Card.Footer>
            </Card>
          </div>
        }
      </>
    );
  }
}

export default SearchRecipes;