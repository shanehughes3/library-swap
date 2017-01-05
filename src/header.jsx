import React from "react";
import {LoginDialog, RegisterDialog} from "./header-dialogs.jsx";

export class Header extends React.Component {
    constructor() {
	super();
	this.state = {
	    dialog: "",
	    loggedIn: false // TODO must pass up
	};
	this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }
    
    openDialog(dialog) {
        if (this.state.dialog === dialog) {
            this.closeDialog();
        } else {
	    this.setState({dialog: dialog});
        }
    }

    closeDialog() {
        this.setState({dialog: ""});
    }
    
    render() {
	let buttons = "";
	if (this.state.loggedIn == false) {
	    buttons = (
                <span>
		    <HeaderButton
		        text="Register"
		        onClick={this.openDialog} />
		    <HeaderButton
		        text="Log In"
		        onClick={this.openDialog} />
                </span>
	    );
	}

	// TODO - push logic to child class?
	let dialog;
	if (this.state.dialog == "Log In") {
	    dialog = (<LoginDialog closeDialog={this.closeDialog}/>);
	} else if (this.state.dialog == "Register") {
	    dialog = (<RegisterDialog closeDialog={this.closeDialog}/>);
	}

	return (
	    <div id="top-bar">
		<a href="/">
                    <span id="name-and-logo">
		        <span id="logo">
			    <img src="/logo.svg" id="logo-img" />
		        </span>
		        <span id="site-name">Library Swap</span>
                    </span>
		</a>
		{buttons}
		{dialog}
	    </div>
	);
    }
}

function HeaderButton(props) {
    return (
	<span className="header-button"
              onClick={() => props.onClick(props.text)}>
	    {props.text}
	</span>
    );
}

