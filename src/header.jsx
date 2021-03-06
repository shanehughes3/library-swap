import React from "react";
import {LoginDialog, RegisterDialog} from "./header-dialogs.jsx";
import {Menu, MenuItem, Popover, Badge, FontIcon} from "material-ui";
import {Ajax} from "./ajax";

export class Header extends React.Component {
    constructor() {
	super();
	this.state = {
	    dialog: "",
            isMenuOpen: false,
            anchorEl: undefined,
            unreadCount: undefined
	};
	this.openDialog = this.openDialog.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    componentWillMount() {
        if (this.props.user) {
            Ajax.get("/unread", (err, response) => {
                if (!err && !response.error) {
                    this.setState({
                        unreadCount: response.count
                    });
                }
            });
        }
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

    openMenu(e) {
        e.preventDefault();
        this.setState({
            isMenuOpen: true,
            anchorEl: e.currentTarget
        });
    }

    closeMenu() {
        this.setState({
            isMenuOpen: false
        });
    }

    render() {
	let buttons = "";

        // logged-in nav
        if (this.props.user) {
            buttons = (
                <span style={{position: "relative"}}>
                    
                    <span
                        id="user-menu"
                        className="header-button"
                        onTouchTap={this.openMenu} >
                        <Badge
                            badgeStyle={{
                                fontFamily: "sans-serif",
                                fontWeight: "bold",
                                padding: 0,
                                top: "-15px",
                                right: "-15px",
                                visibility:
                                  (this.state.unreadCount > 0) ?
                                           "visible" : "hidden"
                            }}
                            badgeContent={this.state.unreadCount || 0}
                            primary >
                            <span id="menu-word">
                                {this.props.user}
                                <FontIcon className="material-icons">
                                    arrow_drop_down
                                </FontIcon>
                            </span>
                            <span id="menu-icon">
                                <FontIcon
                                    className="material-icons" >
                                    menu
                                </FontIcon>
                            </span>
                        </Badge>
                    </span>
                    <Popover
                        open={this.state.isMenuOpen}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{horizontal: "right", vertical: "bottom"}}
                        targetOrigin={{horizontal: "right", vertical: "top"}}
                        onRequestClose={this.closeMenu} >
                        <Menu>
                            <a href="/requests">
                                <MenuItem>Inbox</MenuItem>
                            </a>
                            <a href="/">
                                <MenuItem>Search/Browse</MenuItem>
                            </a>
                            <a href="/books">
                                <MenuItem>My Books</MenuItem>
                            </a>
                            <a href="/profile">
                                <MenuItem>Profile</MenuItem>
                            </a>
                            <a href="/logout">
                                <MenuItem>Log Out</MenuItem>
                            </a>
                        </Menu>
                    </Popover>
                </span>
            );

        // anon nav
        } else {
	    buttons = (
                <span>
                    <div id="anon-menu">
		        <HeaderButton
		            text="Register"
		            onClick={this.openDialog} />
		        <HeaderButton
		            text="Log In"
		            onClick={this.openDialog} />
                    </div>
                </span>
	    );
	} 

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
              onTouchTap={() => props.onClick(props.text)}>
	    {props.text}
	</span>
    );
}

