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
        Ajax.get("/latest", `?o=${this.state.offset}`, (err, res) => {
            if (err) {
                this.setState({
                    error: "Error retrieving latest books"
                });
            } else {
                res = JSON.parse(res);
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
            books: [],
            loading: false,
            error: ""
        };
        this.onQueryChange = this.onQueryChange.bind(this);
    }

    onQueryChange(e) {
        this.setState({
            query: e.target.value
        });
    }
    
    render() {
        return (
            <div style={{ display: this.props.display }}>
                <Textfield
                    id="books-search-field"
                    label="Search"
                    value={this.state.query}
                    onChange={this.onQueryChange}
            floatingLabel />
            <BooksDisplay
                books={this.state.books}
                button={"RequestBook"} />
            </div>
        );
    }
}
