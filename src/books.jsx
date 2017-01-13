import React from "react";
import {Textfield, Spinner} from "react-mdl";
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
        this.addBook = this.addBook.bind(this);
    }
    componentWillMount() {
        Ajax.get("/userBooksList", function(err, books) {
            if (err) {
                console.log(err); ///////////////////////////
            } else {
                console.log(books); ///////////////////////
            }
        });
    }
    addBook() {
        
    }
    render() {
        return (
            <div>
                <Header user={this.props.user} />
                <AddBookInterface addBook={this.addBook} />
                <BooksDisplay books={this.state.books} />
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
    render() {
        return (
            <div>
                <div className="add-book-search">
                    <Textfield
                        onChange={this.onQueryChange}
                        label="Add Book"
                        expandable
                        expandableIcon="add_circle"
                        id="add-book-field" />
                    {(this.state.loading) ? <Spinner singleColor /> : ""}
                </div>
                <BooksDisplay
                    books={this.state.books}
                    addToUser={true} />
            </div>
        );
    }
}

