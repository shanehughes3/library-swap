import React from "react";
import {Router, Route, IndexRoute, Link, browserHistory} from "react-router";
import {Header} from "./header.jsx";

export class Requests extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/requests"
                       user={this.props.user}
                       component={RequestsLayout}>
                    <IndexRoute component={RequestsInbox} />
                    <Route path="incoming" component={RequestsIncoming} />
                    <Route path="outgoing" component={RequestsOutgoing} />
                    <Route path="view/:id" component={RequestView} />
                </Route>
            </Router>
        );
    }
}

export class RequestsLayout extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="requests-container">
                <Header user={this.props.route.user} />
                <RequestsNav />
                <div className="requests-main-window">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export class RequestsNav extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 0
        };
    }
    render() {
        const linkClasses = ["", "", ""];
        linkClasses[this.state.activeTab] = " requests-side-menu-item-active";
        return (
            <div className="requests-side-menu">
                <Link to="/requests/">
                    <div onClick={() => this.setState({activeTab: 0})}
                        className={"requests-side-menu-item" + linkClasses[0]}>
                        Newest Messages
                    </div>
                </Link>
                <Link to="/requests/incoming">
                    <div onClick={() => this.setState({activeTab: 1})}
                        className={"requests-side-menu-item" + linkClasses[1]}>
                        Incoming Requests
                    </div>
                </Link>
                <Link to="/requests/outgoing">
                    <div onClick={() => this.setState({activeTab: 2})}
                        className={"requests-side-menu-item" + linkClasses[2]}>
                        My Requests
                    </div>
                </Link>
            </div>
        );
    }
}

class RequestsInbox extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                Home
            </div>
        );
    }
}

class RequestsIncoming extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                Incoming
            </div>
        );
    }
}

class RequestsOutgoing extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                Outgoing
            </div>
        );
    }
}

class RequestView extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div>
                View
            </div>
        );
    }
}
