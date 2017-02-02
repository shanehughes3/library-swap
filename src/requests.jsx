import React from "react";
import {Router, Route, IndexRoute, Link, browserHistory} from "react-router";
import {List, ListItem, Avatar, Divider, TextField, RaisedButton, RefreshIndicator} from "material-ui";
import {Header} from "./header.jsx";
import {Ajax} from "./ajax";

export class Requests extends React.Component {
    constructor() {
        super();
    }


    
    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/requests"
                       user={this.props.user}
                       component={RequestsLayout} >
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
        this.state = {
            requests: [],
            error: ""
        };
    }

    componentWillMount() {
        Ajax.get("/api/requests", (err, response) => {
            if (err || response.error) {
                this.setState({
                    error: "An error occurred while retrieving requests"
                });
            } else {
                this.setState({
                    error: "",
                    requests: response.requests
                });
            }
        });
    }
    
    render() {
        return (
            <div>
                <RequestList requests={this.state.requests} />
                {this.state.error}
            </div>
        );
    }
}

class RequestsIncoming extends React.Component {
    constructor() {
        super();
        this.state = {
            requests: [],
            error: ""
        };
    }

    componentWillMount() {
        Ajax.get("/api/requests/incoming", (err, response) => {
            if (err || response.error) {
                this.setState({
                    error: "An error occurred while retrieving requests"
                });
            } else {
                this.setState({
                    error: "",
                    requests: response.requests
                });
            }
        });
    }

    render() {
        return (
            <div>
                <RequestList requests={this.state.requests} />
                {this.state.error}
            </div>
        );
    }
}

class RequestsOutgoing extends React.Component {
    constructor() {
        super();
        this.state = {
            requests: [],
            error: ""
        };
    }

    componentWillMount() {
        Ajax.get("/api/requests/outgoing", (err, response) => {
            if (err) { 
                this.setState({
                    error: "An error occurred while retrieving requests" 
                }); 
            } else {
                this.setState({
                    error: "",
                    requests: response.requests 
                });
            } 
        });
    }
    
    render() {
        return (
            <div>
                <RequestList requests={this.state.requests} />
                {this.state.error}
            </div>
        );
    }
}

class RequestView extends React.Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            error: ""
        };
        this.refreshMessages = this.refreshMessages.bind(this);
    }

    componentWillMount() {
        this.refreshMessages();
    }

    refreshMessages() {
        Ajax.get(`/api/requests/${this.props.params.id}/messages`,
                 (err, response) => {
                     if (err || response.error) {
                         this.setState({
                             error: "Sorry, an error occurred"
                         });
                     } else {
                         this.setState({
                             error: "",
                             messages: response.messages
                         });
                     }
                 });
    }
    
    render() {
        return (
            <div>
                <RequestHeaderForMessages
                    requestId={this.props.params.id}
                    refreshMessages={this.refreshMessages}
                />
                <NewMessageDialog
                    requestId={this.props.params.id}
                    refresh={this.refreshMessages}
                />
                <MessageList messages={this.state.messages} />
                {this.state.error}
            </div>
        );
    }
}

class RequestList extends React.Component {
    constructor() {
        super();
    }
    render() {
        let listItems;
        if (this.props.requests && this.props.requests.length > 0) {
            listItems = this.props.requests.map((request) => {
                return (
                    <Link to={`/requests/view/${request.id}`} key={request.id} >
                        <ListItem
                            leftAvatar={
                                <Avatar
                                    src={request.SellerBook.thumbnail || ""} />
                            }
                            primaryText={request.SellerBook.title}
                            secondaryText={`Offer: ${request.BuyerBook.title}`}
                            secondaryTextLines={1} />
                    </Link>
                );
            });
        }

        return (
            <div>
                <List>
                    {listItems}
                </List>
            </div>
        );
    }
}

class RequestHeaderForMessages extends React.Component {
    constructor() {
        super();
        this.state = {
            request: null,
            error: ""
        };
    }

    componentWillMount() {
        this.getRequest();
    }

    getRequest() {
        Ajax.get(`/api/requests/${this.props.requestId}`, (err, response) => {
            if (err || response.error) {
                this.setState({
                    error: "Sorry, an error occurred"
                });
            } else {
                this.setState({
                    error: "",
                    request: response.request
                });
            }
        });
    }

    render() {
        let content;
        if (!this.state.request && !this.state.error) {
            content = (
                <div style={{textAlign: "center", width: "100%"}}>
                    <RefreshIndicator
                        status="loading"
                        left={0}
                        top={0}
                    />
                </div>
            );
        } else if (this.state.request) {
            content = (
                <RequestList requests={ [this.state.request] } />
            );
        }
        return (
            <div>
                {content}
                {this.state.error}
            </div>
        );
    }
}

class NewMessageDialog extends React.Component {
    constructor() {
        super();
        this.state = {
            messageText: "",
            statusMessage: "",
            loading: false
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    sendMessage() {
        const {messageText} = this.state;
        this.setState({
            loading: true,
            statusMessage: ""
        });
        Ajax.post(`/api/requests/${this.props.requestId}/messages`,
                  { message: messageText },
                  (err, response) => {
                      if (err || response.error) {
                          this.setState({
                              loading: false,
                              statusMessage: "Sorry, an error occurred"
                          });
                      } else {
                          this.setState({
                              loading: false,
                              statusMessage: "",
                              messageText: ""
                          });
                          this.props.refresh();
                      }
                  });
    }

    handleChange(e) {
        if (e.target.value.length <= 500) {
            this.setState({
                messageText: e.target.value
            });
        }
    }

    render() {
        let buttonOrSpinner;
        if (this.state.loading) {
            buttonOrSpinner = (
                <RefreshIndicator
                    status="loading"
                    left={0}
                    top={0}
                />
            );
        } else {
            buttonOrSpinner = (
                <RaisedButton
                    onClick={this.sendMessage}
                    primary
                    label="Send Message"
                />
            );
        }
        
        return (
            <div>
                <TextField
                    hintText="Send a message"
                    multiLine={true}
                    rows={2}
                    rowsMax={4}
                    value={this.state.messageText}
                    onChange={this.handleChange}
                />
                <span className="message-chars-remaining" >
                    {500 - this.state.messageText.length} characters remaining
                </span>
                {buttonOrSpinner}
            </div>
        );
    }
}

class MessageList extends React.Component {
    constructor() {
        super();
    }

    render() {
        let listItems;
        if (this.props.messages && this.props.messages.length > 0) {
            listItems = this.props.messages.map((message) => {
                const align = (message.source === "self") ? "right" : "left";
                const width = (message.source === "server") ? "100%" : "70%";
                return (
                    <div
                        style={{
                            float: align,
                            textAlign: align,
                            width: width
                        }}
                        className="message"
                        key={message.id} >
                        {message.text}
                    </div>
                );
            });
        }
        return (
            <div>
                {listItems}
            </div>
        );
    }
}
