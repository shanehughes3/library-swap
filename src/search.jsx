import React from "react";
import {Textfield, Spinner, Tabs, Tab} from "react-mdl";
import {Ajax} from "./ajax";
import {BooksDisplay} from "./books-display.jsx";

export class SearchArea extends React.Component {
    constructor() {
        super();
        this.state = {
            activeTab: 0
        };
    }

    render() {
        return (
            <div>
                <Tabs
                    activeTab={this.state.activeTab}
                    onChange={(tabId) => this.setState({ activeTab: tabId })} >
                    <Tab>Newest Offerings</Tab>
                    <Tab>Search</Tab>
                </Tabs>
                <LatestBooks
                    display={(this.state.activeTab === 0) ?
                                      "block" : "none" } />
                <SearchBooks
                    display={(this.state.activeTab === 1) ?
                                      "block" : "none" } />
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
        Ajax.get("/booksApi/latest", `?o=${this.state.offset}`, (err, res) => {
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
        let spinner = null;
        // spinner before initial book list load only
        if (this.state.books.length === 0 &&
            this.state.error === "") {
            spinner = (<Spinner singleColor />);
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
        Ajax.get("/booksApi/search",
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
        let message;
        if (this.state.error) {
            message = this.state.error;
        } else if (this.state.books.length === 0) {
            message = "No results to display";
        }
        return (
            <div style={{ display: this.props.display }}>
                <Textfield
                    id="books-search-field"
                    label="Enter search terms..."
                    value={this.state.query}
                    onChange={this.onQueryChange}
                    floatingLabel />
                <div className="middle-message">
                    {(this.state.loading) ? <Spinner singleColor /> : null}
                    {message}
                </div>
                    <BooksDisplay
                        books={this.state.books}
                        button={"RequestBook"} />
            </div>
        );
    }
}
