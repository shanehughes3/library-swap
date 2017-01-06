import React from "react";
import {Textfield, Button, IconButton} from "react-mdl";

export class LoginDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    onSubmit() {
        
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
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
                            id="username-field" />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Password"
                            type="password"
                            id="password-field" />
                    </div>
                    <div>
                        <Button
                            onClick={this.onSubmit}
                            raised colored ripple>
                            Log In</Button>
                    </div>
                </form>
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
            confirm: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    onSubmit() {
        
    }
    render() {
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
                            id="username-field" />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Password"
                            id="password-field"
                            type="password" />
                    </div>
                    <div>
                        <Textfield
                            onChange={this.handleChange}
                            label="Confirm Password"
                            id="confirm-field"
                            type="password" />
                    </div>
                    <div>
                        <Button
                            onClick={this.onSubmit}
                            raised colored ripple>
                            Register</Button>
                    </div>
                </form>
            </div>
        );
    }
}

