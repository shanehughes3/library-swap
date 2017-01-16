import React from "react";
import {Textfield, Button, IconButton, Spinner} from "react-mdl";
import {Ajax} from "./ajax";

const postOptions = {
    contentType: "x-www-form-urlencoded"
};

export class LoginDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            message: "",
            loading: false
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit() {
        this.setState({
            message: "",
            loading: true
        });
        if (this.state.username && this.state.password) {
            const payload = {
                username: this.state.username,
                password: this.state.password
            };
            Ajax.post("/login", payload, postOptions, (err, data) => {
                if (err) {
                    this.setState({
                        message: "An unknown error occurred",
                        loading: false
                    });
                } else {
                    if (data.error) {
                        this.setState({
                            message: data.error,
                            loading: false,
                            password: ""
                        });
                    } else {
                        this.setState({
                            loading: false,
                            message: "Success!"
                        });
                        window.location.reload(true);
                    }
                }
            });
        } else {
            this.setState({
                message: "Please complete all fields",
                loading: false
            });
        }
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        let message, spinner;
        if (this.state.message) {
            message = (
                <span className="dialog-message">
                    {this.state.message}
                </span>
            );
        }
        if (this.state.loading) {
            spinner = (
                <Spinner singleColor />
            );
        }
        return (
            <div className="header-dialog">
                <IconButton
                    name="close"
                    onClick={this.props.closeDialog}
                    className="header-dialog-close" />
                <form action="javascript:void(0)" method="post">
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Username"
                            id="username-field"
                            name="username"
                            value={this.state.username}
                            autoFocus />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Password"
                            type="password"
                            id="password-field"
                            name="password"
                            value={this.state.password} />
                    </div>
                    <div>
                        <Button
                            onClick={this.onSubmit}
                            raised colored ripple>
                            Log In</Button>
                    </div>
                </form>
                {spinner}
                {message}
            </div>
        );
    }
}

export class RegisterDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            confirm: "",
            message: "",
            loading: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    onSubmit() {
        this.setState({
            message: "",
            loading: true
        });
        if (this.checkFields()) {
            const payload = {
                username: this.state.username,
                password: this.state.password
            };
            Ajax.post("/register", payload, postOptions, (err, data) => {
                if (err) {
                    this.setState({
                        message: "An unknown error occurred",
                        loading: false
                    });
                    console.log(err);
                } else {
                    if (data.error) {
                        this.setState({
                            loading: false,
                            message: data.error
                        });
                    } else {
                        this.setState({
                            loading: false,
                            message: "Success!"
                        });
                        window.location.reload(true);
                    }
                }
            });
        }
    }
    
    checkFields() {
        if (!this.state.username || !this.state.password ||
            !this.state.confirm) {
            this.setState({
                message: "Please complete all fields",
                loading: false
            });
            return false;
        } else if (this.state.password !== this.state.confirm) {
            this.setState({
                message: "Password and confirmation do not match",
                loading: false
            });
            return false;
        } else if (this.state.password.length < 8) {
            this.setState({
                message: "Password must be at least 8 characters",
                loading: false
            });
            return false;
        } else {
            return true;
        }
    }
    
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
        let message, spinner;
        if (this.state.message) {
            message = (
                <span className="dialog-message">
                    {this.state.message}
                </span>
            );
        }
        if (this.state.loading) {
            spinner = (
                <Spinner singleColor />
            );
        }
        return (
            <div className="header-dialog">
                <IconButton
                    name="close"
                    onClick={this.props.closeDialog}
                    className="header-dialog-close" />
                <form action="javascript:void(0)" method="post">
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Username"
                            id="username-field"
                            name="username"
                            value={this.state.username}
                            autoFocus />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Password"
                            id="password-field"
                            type="password"
                            name="password"
                            value={this.state.password} />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Confirm Password"
                            id="confirm-field"
                            type="password"
                            name="confirm"
                            value={this.state.confirm} />
                    </div>
                    <div>
                        <Button
                            onClick={this.onSubmit}
                            raised colored ripple>
                            Register</Button>
                    </div>
                </form>
                {spinner}
                {message}
            </div>
        );
    }
}


