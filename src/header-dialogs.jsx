import React from "react";

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
                <div className="header-dialog-close"
                     onClick={this.props.closeDialog}>&times;</div>
                <form action="javascript:void(0)" method="post">
                    <div>
                        <input className="input-field" type="text"
                               name="username" id="username-field"
                               placeholder="Username" autoFocus
                               onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="input-field" type="text"
                               name="password" id="password-field"
                               placeholder="Password"
                               onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="button" type="submit"
                               value="Log In" onClick={this.onSubmit} />
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
                <div className="header-dialog-close"
                     onClick={this.props.closeDialog}>&times;</div>
                <form action="javascript:void(0)" method="post">
                    <div>
                        <input className="input-field" type="text"
                               name="username" id="username-field"
                               placeholder="Username" autoFocus
                               onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="input-field" type="text"
                               name="password" id="password-field"
                               placeholder="Password"
                               onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="input-field" type="text"
                               name="confirm" id="confirm-field"
                               placeholder="Confirm Password"
                               onChange={this.handleChange} />
                    </div>
                    <div>
                        <input className="button" type="submit"
                               value="Register" onClick={this.onSubmit} />
                    </div>
                </form>
            </div>
        );
    }
}

