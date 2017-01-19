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
            <div>
                <Header user={this.props.route.user} />
                <RequestsNav />
                {this.props.children}
            </div>
        );
    }
}

export class RequestsNav extends React.Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div className="requests-side-menu">
                <Link to="/requests/">
                    <div className="requests-side-menu-item">
                        Newest Messages
                    </div>
                </Link>
                <Link to="/requests/incoming">
                    <div className="requests-side-menu-item">
                        Incoming Requests
                    </div>
                </Link>
                <Link to="/requests/outgoing">
                    <div className="requests-side-menu-item">
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
                
            </div>
        );
    }
}
