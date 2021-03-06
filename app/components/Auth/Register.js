import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import check from '../../images/todo.png';

import RepositoryWrapper from '../../services/RepositoryWrapper';
const repo = new RepositoryWrapper();

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const email = value => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vpassword = value => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeForm = this.onChangeForm.bind(this);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      successful: false,
      message: ""
    };
  }

  onChangeForm(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      repo.AuthService.register(
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    return (
      <header className="login" style={{ paddingBottom: "calc(15.7rem - 3.6rem)" }}>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col-md-7">
              <Card className="text-center shadow">
                <Card.Header className="text-center" style={{ borderBottom: "none" }}>
                  <img src={check} style={{ width: "250px" }} />
                </Card.Header>
                <Card.Body>
                  <Card.Title className="text-center">Register</Card.Title>
                  <Form
                    onSubmit={this.handleRegister}
                    ref={c => {
                      this.form = c;
                    }}
                  >
                    {!this.state.successful && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="firstName">First name</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="firstName"
                            value={this.state.firstName}
                            onChange={this.onChangeForm}
                            validations={[required]}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last name</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="lastName"
                            value={this.state.lastName}
                            onChange={this.onChangeForm}
                            validations={[required]}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <Input
                            type="text"
                            className="form-control"
                            name="email"
                            value={this.state.email}
                            onChange={this.onChangeForm}
                            validations={[required, email]}
                          />
                        </div>

                        <div className="form-group">
                          <label htmlFor="password">Password</label>
                          <Input
                            type="password"
                            className="form-control"
                            name="password"
                            value={this.state.password}
                            onChange={this.onChangeForm}
                            validations={[required, vpassword]}
                          />
                        </div>

                        <div className="form-group">
                          <button className="btn btn-primary btn-block">Sign Up</button>
                        </div>
                        <Link to="/Login">Already have an account</Link>
                      </div>
                    )}

                    {this.state.message && (
                      <div className="form-group">
                        <div
                          className={
                            this.state.successful
                              ? "alert alert-success"
                              : "alert alert-danger"
                          }
                          role="alert"
                        >
                          {this.state.message}
                        </div>
                        <div className="form-group">
                          <Link className="btn btn-primary btn-block" to="/Login">Log in</Link>
                        </div>
                      </div>

                    )}
                    <CheckButton
                      style={{ display: "none" }}
                      ref={c => {
                        this.checkBtn = c;
                      }}
                    />
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </header>
    );
  }
}