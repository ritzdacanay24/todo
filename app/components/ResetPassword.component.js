import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import check from '../images/todo.png';
import queryString from 'query-string';
import AuthService from "../services/auth.service";
import { Link } from 'react-router-dom';

const required = value => {
    if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
                This field is required!
            </div>
        );
    }
};

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.verifyPasswordToken = this.verifyPasswordToken.bind(this);

        this.params = queryString.parse(props.location.search);

        this.state = {
            isTokenValid: false,
            password: "",
            loading: false,
            message: "",
            isPasswordUpdated: false,
            class: "alert alert-warning"
        };
    }

    componentDidMount() {
        this.verifyPasswordToken();
    }

    verifyPasswordToken = async () => {
        try {
            let res = await AuthService.verifyPasswordToken(this.params.token)
            this.setState({
                isTokenValid: res.data.message
            });

        } catch (e) {
            this.setState({
                message: e.response
            });
        }
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
            let params = {
                password: this.state.password,
                token: this.params.token
            }
            AuthService.resetPassword(params).then(
                async (res) => {
                    try {
                        this.setState({
                            loading: false,
                            message: "Password updated",
                            isPasswordUpdated: true,
                            class: "alert alert-success"
                        });
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
                        message: resMessage,
                        class: "alert alert-danger"
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
            <header className="login" style={{paddingBottom: "calc(30.5rem)"}}>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-md-7">
                            <Card className="text-center shadow">
                                <Card.Header style={{ borderBottom: "none" }}>
                                    <img src={check} style={{ width: "250px" }} />
                                </Card.Header>
                                {this.state.isTokenValid ? <Card.Body>
                                    <Card.Title>Code is valid</Card.Title>
                                    <Card.Text>Please enter new password</Card.Text>
                                    {this.state.message && (
                                        <div className="form-group">
                                            <div className={this.state.class} role="alert">
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
                                                className="btn btn-primary float-right"
                                                disabled={this.state.loading || !this.state.password}
                                            >
                                                {this.state.loading && (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                                <span> Submit </span>
                                            </button>
                                        </div>

                                        <div className="form-group">
                                            <Link to="/Login">
                                                <button
                                                    className="btn btn-outline-info float-left"
                                                    type="button"

                                                >
                                                    Log-in
                                            </button>
                                            </Link>
                                        </div>

                                        <CheckButton
                                            style={{ display: "none" }}
                                            ref={c => {
                                                this.checkBtn = c;
                                            }}
                                        />
                                    </Form>
                                </Card.Body>
                                    :
                                    <Card.Body>
                                        <Card.Title>Token invalid</Card.Title>
                                        <div className="form-group">
                                            <Link to="/Login">
                                                <button
                                                    className="btn btn-outline-info float-left"
                                                    type="button"

                                                >
                                                    Log-in
                                            </button>
                                            </Link>
                                        </div>

                                    </Card.Body>
                                }
                            </Card>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}