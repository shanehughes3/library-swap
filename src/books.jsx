import React from "react";
import {TextField, RefreshIndicator, IconButton} from "material-ui";
import {Header} from "./header.jsx";
import {Ajax} from "./ajax";
import {BooksDisplay} from "./books-display.jsx";

export class Books extends React.Component {
    constructor() {
        super();
        this.state = {
            books: [],
            viewOffset: 0
        };
    }
    
    componentWillMount() {
        Ajax.get("/api/books/user", (err, res) => {
            if (err || res.error) {
                console.log(err); ///////////////////////////
            } else {
                this.setState({
                    books: res.books
                });
                console.log(res); ///////////////////////
            }
        });
    }

    render() {
        return (
            <div>
                <Header user={this.props.user} />
                <AddBookInterface />
                <div className="mid-page-title">
                    My Books ({this.state.books.length})
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="DeleteBook" />
            </div>
        );
    }
}

class AddBookInterface extends React.Component {
    constructor() {
        super();
        this.state = {
            query: "",
            queryOffset: 0,
            timeout: undefined,
            loading: false,
            books: [],
            error: ""
        };
        this.onQueryChange = this.onQueryChange.bind(this);
        this.closeSearch = this.closeSearch.bind(this);
    }
    
    onQueryChange(e) {
        if (typeof this.state.timeout === "number") {
            window.clearTimeout(this.state.timeout);
        }
        
        this.setState({
            query: e.target.value,
            timeout: window.setTimeout(() => {
                this.sendQuery();
            }, 500)
        });
    }
    
    sendQuery() {
        this.setState({
            loading: true,
            timeout: undefined });
        Ajax.get("/api/books/lookup", {
            q: this.state.query,
            o: this.state.queryOffset
        }, (err, res) => {
            if (err || res.error) {
                this.setState({
                    error: "Sorry, an error occurred",
                    loading: false
                });
            } else {
                this.setState({
                    books: res.books,
                    loading: false
                });
            }
        });
    }
    
    closeSearch() {
        this.setState({
            query: "",
            queryOffset: 0,
            timeout: undefined,
            loading: false,
            books: [],
            error: ""
        });
    }
    
    render() {
        let closeButton;
        if (this.state.books.length > 0) {
            closeButton = (
                <IconButton
                    iconClassName="material-icons"
                    onTouchTap={this.closeSearch}>highlight_off</IconButton>
            );
        }
        return (
            <div>
                <div className="search-controls">
                    <div className="add-book-search">
                        <TextField 
                            onChange={this.onQueryChange}
                            value={this.state.query}
                            floatingLabelText="Add new book..."
                            id="add-book-field" />
                        <RefreshIndicator
                            status={(this.state.loading) ? "loading" : "hide"}
                            left={0}
                            top={0} />
                    </div>
                    {closeButton}
                    {this.state.error}
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="AddBook"/>
            </div>
        );
    }
}

