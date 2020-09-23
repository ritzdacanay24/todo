import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import { Link } from 'react-router-dom';
import check from '../../images/todo.png';

import AuthService from "../../services/auth.service";
import KrogerService from "../../services/kroger.service";

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);

        this.state = {
            email: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    onChangeUsername(e) {
        this.setState({
            email: e.target.value
        });
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.login(this.state.email, this.state.password).then(
                async (res) => {
                    try {
                        await KrogerService.redirectToGroceryAppAfterLoginByClientCredentials();
                        window.location.href = '/ToDo';
                    } catch (e) {
                        this.setState({
                            loading: false
                        });
                    }
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.setState({
                        loading: false,
                        message: resMessage
                    });
                }
            );
        } else {
            this.setState({
                loading: false
            });
        }
    }

    render() {
        return (
            <header className="login" style={{paddingBottom: "calc(34.1rem - 4.6rem)"}}>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-md-7">
                            <Card className="text-center shadow">
                                <Card.Header style={{ borderBottom: "none" }}>
                                    <img src={check} style={{ width: "250px" }} />
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Sign in to Grocery todo App</Card.Title>
                                    {this.state.message && (
                                        <div className="form-group">
                                            <div className="alert alert-danger" role="alert">
                                                {this.state.message}
                                            </div>
                                        </div>
                                    )}
                                    <Form
                                        onSubmit={this.handleLogin}
                                        ref={c => {
                                            this.form = c;
                                        }}
                                    >
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroup-sizing-default" style={{ minWidth: "100px", maxWidth: "100px" }}>Email</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl type="text"
                                                className="form-control"
                                                name="email"
                                                placeholder="Enter email"
                                                value={this.state.email}
                                                onChange={this.onChangeUsername}
                                                validations={[required]} />
                                        </InputGroup>

                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="inputGroup-sizing-default" style={{ minWidth: "100px", maxWidth: "100px" }}>Password</InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <FormControl type="password"
                                                className="form-control"
                                                placeholder="Enter password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.onChangePassword}
                                                validations={[required]} />
                                        </InputGroup>

                                        <div className="form-group">
                                            <button
                                                className="btn btn-primary float-left"
                                                disabled={this.state.loading}
                                            >
                                                {this.state.loading && (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                                <span> Sign In </span>
                                            </button>
                                        </div>

                                        <CheckButton
                                            style={{ display: "none" }}
                                            ref={c => {
                                                this.checkBtn = c;
                                            }}
                                        />
                                    </Form>
                                    <Button variant="primary" as={Link} to="/Register" className="float-right">Register</Button>
                                    <div className="form-group">
                                        Forgot password? <Link to="/PasswordRequest">Reset It</Link>
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}