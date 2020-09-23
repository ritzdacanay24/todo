import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import check from '../../images/todo.png';
import AuthService from "../../services/auth.service";
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

export default class PasswordRequest extends Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);

        this.state = {
            email: "",
            loading: false,
            message: "",
            isSent: false
        };
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        });
    }

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true,
            class: ""
        });

        this.form.validateAll();

        if (this.checkBtn.context._errors.length === 0) {
            AuthService.forgotPassword(this.state.email).then(
                async (res) => {

                    try {
                        this.setState({
                            loading: false,
                            message: res.data,
                            class: "alert alert-success",
                            isSent: true
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
            <header className="login" style={{ paddingBottom: "calc(34.1rem - 3.6rem)" }}>
                <div className="container">
                    <div className="row justify-content-md-center">
                        <div className="col-md-7">
                            <Card className="text-center shadow">
                                <Card.Header style={{ borderBottom: "none" }}>
                                    <img src={check} style={{ width: "250px" }} />
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Can't remember password?</Card.Title>
                                    <Card.Text>We will send an email to reset your password</Card.Text>
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



                                        {
                                            !this.state.isSent &&

                                            <>
                                                <InputGroup className="mb-3">
                                                    <FormControl type="email"
                                                        className="form-control"
                                                        placeholder="Enter email"
                                                        name="email"
                                                        value={this.state.email}
                                                        onChange={this.onChangeEmail}
                                                        validations={[required]} />
                                                </InputGroup>
                                                <div className="form-group">
                                                    <button
                                                        className="btn btn-primary float-right"
                                                        disabled={this.state.loading}
                                                    >
                                                        {this.state.loading && (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        )}
                                                        <span> Submit </span>
                                                    </button>
                                                </div>
                                            </>
                                        }

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
                            </Card>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}