import React from "react";
import {TextField, RefreshIndicator, IconButton} from "material-ui";
import {Header} from "./header.jsx";
import {Footer} from "./footer.jsx";
import {Ajax} from "./ajax";
import {BooksDisplay} from "./books-display.jsx";

export class Books extends React.Component {
    constructor() {
        super();
        this.state = {
            books: [],
            viewOffset: 0,
            message: "",
            loading: true
        };
    }
    
    componentWillMount() {
        Ajax.get("/api/books/user", (err, res) => {
            if (err || res.error) {
                this.setState({
                    message: "Error retrieving books",
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

    render() {
        let spinner;
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
            <div>
                <Header user={this.props.user} />
                <AddBookInterface />
                <div className="mid-page-title">
                    My Books ({this.state.books.length})
                </div>
                <div className="middle-message">
                    {spinner}
                    {this.state.message}
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="DeleteBook" />
                <Footer />
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
            timeout: undefined,
            error: ""
        });
        if (this.state.query) {
            Ajax.get("/api/books/lookup", {
                q: this.state.query,
                o: this.state.queryOffset
            }, (err, res) => {
                if (err || res.error) {
                    this.setState({
                        error: "Sorry, an error occurred",
                        loading: false
                    });
                } else if (res.books.length === 0) {
                    this.setState({
                        error: "No results",
                        loading: false
                    });
                } else {
                    this.setState({
                        books: res.books,
                        loading: false
                    });
                }
            });
        } else {
            this.setState({
                loading: false
            });
        }
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
                        
                    </div>
                    {closeButton}
                    {this.state.error}
                    <div style={{
                        position: "relative",
                        display: "inline-block",
                        height: "40px",
                        width: "40px",
                        marginTop: "1em"
                    }}>
                        <RefreshIndicator
                            status={(this.state.loading) ? "loading" : "hide"}
                            left={0}
                            top={0} />
                    </div>
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="AddBook"/>
            </div>
        );
    }
}

