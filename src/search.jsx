import React from "react";
import {TextField, RefreshIndicator, Tabs, Tab} from "material-ui";
import {Ajax} from "./ajax";
import {BooksDisplay} from "./books-display.jsx";

export class SearchArea extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 0
        };
        this.changeTab = this.changeTab.bind(this);
    }

    changeTab(tabId) {
        this.setState({
            activeTab: tabId
        });
    }

    render() {
        return (
            <div>
                <Tabs
                    value={this.state.activeTab}
                    onChange={this.changeTab}
                    inkBarStyle={{background: "white", color: "rgba(0,0,0,0,87)"}}>
                    <Tab label="Newest Offerings" value={0} >
                        <LatestBooks />
                    </Tab>
                    <Tab label="Search" value={1} >
                        <SearchBooks />
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

class LatestBooks extends React.Component {
    constructor() {
        super();
        this.state = {
            error: "",
            books: [],
            offset: 0
        };
    }

    componentWillMount() {
        Ajax.get("/api/books/latest", `?o=${this.state.offset}`, (err, res) => {
            if (err) {
                this.setState({
                    error: "Error retrieving latest books"
                });
            } else {
                if (res.error || res.books == false) { // check for empty
                    this.setState({
                        error: "No books to display"
                    });
                } else {
                    this.setState({
                        books: res.books
                    });
                }
            }
        });
    }

    render() {
        let spinner;
        if (this.state.books.length === 0 &&
            this.state.error === "") {
            // spinner before initial list load only
            spinner = (
                <div className="spinner-container">
                    <RefreshIndicator
                        status="loading"
                        left={0}
                        top={0} />
                </div>
            );
        }
        return (
            <div style={{ display: this.props.display }}>
                <div className="middle-message">
                    {spinner}
                    {this.state.error}
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="RequestBook" />
            </div>
        );
    }
}

class SearchBooks extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            offset: 0,
            books: [],
            loading: false,
            error: "",
            timeout: null
        };
        this.onQueryChange = this.onQueryChange.bind(this);
    }

    onQueryChange(e) {
        if (typeof this.state.timeout === "number") {
            window.clearTimeout(this.state.timeout);
        }

        this.setState({
            query: e.target.value
        });

        if (e.target.value) {
            // don't send requests on "", which throws a SQL error
            this.setState({
                timeout: window.setTimeout(() => {
                    this.sendQuery();
                }, 500)
            });
        } else {
            this.setState({
                loading: false,
                books: [],
                timeout: undefined,
                error: ""
            });
        }
    }

    sendQuery() {
        this.setState({
            loading: true,
            timeout: undefined,
            error: "",
            books: []
        });
        Ajax.get("/api/books/search",
                 `?q=${encodeURIComponent(this.state.query)}` + 
                 `&o=${this.state.offset}`,
                 (err, res) => {
                     if (err) {
                         this.setState({
                             loading: false,
                             error: "Sorry, an error occurred"
                         });
                     } else {
                         if (res.error) {
                             this.setState({
                                 loading: false,
                                 error: "Sorry, an error occurred"
                             });
                         } else {
                             this.setState({
                                 loading: false,
                                 books: res.books || []
                             });
                         }
                     }
                 });
    }
    
    render() {
        let message, spinner;
        if (this.state.error) {
            message = this.state.error;
        } else if (this.state.books.length === 0) {
            message = "No results to display";
        }

        if (this.state.loading) {
            spinner = (
                <div className="spinner-container">
                    <RefreshIndicator
                        status="loading"
                        left={0}
                        top={0} />
                </div>
            );
        }
        return (
            <div style={{ display: this.props.display }}>
                <div id="books-search-container">
                    <TextField
                        id="books-search-field"
                        floatingLabelText="Enter search terms..."
                        value={this.state.query}
                        onChange={this.onQueryChange} />
                </div>
                <div className="middle-message">
                    {spinner}
                    {message}
                </div>
                    <BooksDisplay
                        books={this.state.books}
                        button={"RequestBook"} />
            </div>
        );
    }
}
