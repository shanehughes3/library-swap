import React from "react";
import {TextField, RaisedButton, IconButton, RefreshIndicator} from "material-ui";
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
        let message;
        if (this.state.message) {
            message = (
                <span className="dialog-message">
                    {this.state.message}
                </span>
            );
        }
        return (
            <div className="header-dialog">
                <div className="header-dialog-close">
                    <IconButton
                        name="close"
                        onTouchTap={this.props.closeDialog}
                        iconClassName="material-icons">
                        close</IconButton>
                </div>    
                <form
                    action="javascript:void(0)"
                    method="post"
                    onSubmit={this.onSubmit} >
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            hintText="Username"
                            id="username-field"
                            name="username"
                            value={this.state.username}
                            autoFocus />
                    </div>
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            hintText="Password"
                            type="password"
                            id="password-field"
                            name="password"
                            value={this.state.password} />
                    </div>
                    <div>
                        <RaisedButton
                            onTouchTap={this.onSubmit}
                            label="Log In"
                            type="submit"
                            primary />
                    </div>
                </form>
                <div style={{position: "relative"}}> {/* TODO fix positioning for spinner */}
                    <RefreshIndicator
                        status={(this.state.loading) ? "loading" : "hide"}
                        left={0}
                        top={0} />
                </div>
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
        let message;
        if (this.state.message) {
            message = (
                <span className="dialog-message">
                    {this.state.message}
                </span>
            );
        }
        return (
            <div className="header-dialog">
                <div className="header-dialog-close">
                    <IconButton
                        onTouchTap={this.props.closeDialog}
                        iconClassName="material-icons">close</IconButton>
                </div>
                <form
                    action="javascript:void(0)"
                    method="post"
                    onSubmit={this.onSubmit} >
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            hintText="Username"
                            id="username-field"
                            name="username"
                            value={this.state.username}
                            autoFocus />
                    </div>
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            hintText="Password"
                            id="password-field"
                            type="password"
                            name="password"
                            value={this.state.password} />
                    </div>
                    <div>
                        <TextField
                            onChange={this.handleChange}
                            hintText="Confirm Password"
                            id="confirm-field"
                            type="password"
                            name="confirm"
                            value={this.state.confirm} />
                    </div>
                    <div>
                        <RaisedButton
                            onTouchTap={this.onSubmit}
                            type="submit"
                            label="Register"
                            primary />
                    </div>
                </form>
                <RefreshIndicator
                    status={(this.state.loading) ? "loading" : "hide"}
                    left={0}
                    top={0} />
                {message}
            </div>
        );
    }
}


