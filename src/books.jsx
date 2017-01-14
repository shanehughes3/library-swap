import React from "react";
import {Textfield, Spinner, FABButton, Icon, IconButton} from "react-mdl";
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
        Ajax.get("/userBooksList", (err, res) => {
            if (err) {
                console.log(err); ///////////////////////////
            } else {
                res = JSON.parse(res);
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
        Ajax.get("/lookup",
                 `?q=${encodeURIComponent(this.state.query)}
                    &o=${this.state.queryOffset}`,
                 (err, books) => {
                     if (err) {
                         this.setState({
                             error: "Sorry, an error occurred",
                             loading: false
                         });
                         console.log("Error: ", err); //////////
                     } else {
                         this.setState({
                             books: JSON.parse(books).books,
                             loading: false
                         });
                         console.log(JSON.parse(books)); //////////////
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
                    name="highlight_off"
                    onClick={this.closeSearch} />
            );
        }
        return (
            <div>
                <div className="search-controls">
                    <div className="add-book-search">
                        <Textfield 
                            label="Add a book"
                            onChange={this.onQueryChange}
                            value={this.state.query}
                            label="Add new book..."
                            floatingLabel
                            id="add-book-field" />
                        {(this.state.loading) ? <Spinner singleColor /> : ""}
                    </div>
                    {closeButton}
                </div>
                <BooksDisplay
                    books={this.state.books}
                    button="AddBook"/>
            </div>
        );
    }
}

