import React from "react";
import {Card, CardTitle, CardText,
        CardActions, CardMenu, Button, Spinner, Tooltip, Icon} from "react-mdl";
import {Ajax} from "./ajax";

export class BooksDisplay extends React.Component {
    constructor() {
        super();
    }

    getInfo(book) {
        let authors = "";
        if (book.authors) { // array from google api
            book.authors.forEach((authorName) => {
                if (authors) {
                    authors += ", "
                }
                authors += authorName;
            });
        } else if (book.author) { // string from our db
            authors = book.author;
        }

        let published = "";
        if (book.publishedDate) { // from google api, e.g. "2010-12-13"
            published = book.publishedDate.slice(0,4);
        } else if (book.publishedYear) { // from db
            published = book.publishedYear;
        }

        return (
            <span>
                <b>Title: </b>{book.title || ""}<br />
            <b>Subtitle: </b>{book.subtitle || ""}<br />
            <b>Authors: </b>{authors}<br />
            <b>Published: </b>{published}<br />
            <b>Publisher: </b>{book.publisher || ""}<br />
            <b>Pages: </b>{book.pageCount || book.pages || ""}
            </span>
        );
    }
    
    render() {
        let cards;
        if (this.props.books) {
            cards = this.props.books.map((book) => {
                let cardButton;
                if (this.props.button) {
                    const ThisButton = buttonTypes[this.props.button];
                    cardButton = (
                        <ThisButton
                            id={book.id} />
                    );
                }
                return ( 
                    <Card
                        key={book.id}
                        shadow={1}
                        className="book-card">
                    <CardTitle
                            expand
                            className="book-title"
                            style={(book.thumbnail) ?
                                   // prevent requests to /null or /undefined
                                   {background: `url(${book.thumbnail})` +
                                                "no-repeat center" } :
                                   {}
                                  }>
                        </CardTitle>
                        <CardText>
                            {book.title || ""} {(book.authors) ?
                                                  "- " + book.authors[0] : ""}
                        </CardText>
                        <CardActions border>
                            {cardButton}
                        </CardActions>
                        <CardMenu>
                            <Tooltip
                                label={this.getInfo(book)}
                                className="tooltip-icon"
                                large >
                                <Icon name="info_outline" />
                            </Tooltip>
                        </CardMenu>
                    </Card>
                );
            });
        }
        return (
            <div className="cards-container">
                {cards}
            </div>
        );
    }
}

class AddBookButton extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            message: null
        };
        this.addBook = this.addBook.bind(this);
    }
    addBook() {
        this.setState({
            loading: true,
            message: null
        });
        Ajax.post("/booksApi", {id: this.props.id}, (err, res) => {
            if (err) {
                this.setState({
                    loading: false,
                    message: "Error sending request"
                });
            } else {
                if (res.error) {
                    this.setState({
                        loading: false,
                        message: "Sorry, an error occurred"
                    });
                } else {
                    this.setState({
                        loading: false,
                        message: "Success!"
                    });
                    window.location.reload(true);
                }
            }
        });
    }
    render() {
        return (
            <div>
                <Button colored onClick={this.addBook}>Add Book</Button>
                {(this.state.loading) ? <Spinner singleColor /> : null}
                {this.state.message}
            </div>
        );
    }
}

class DeleteBookButton extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: false,
            message: null
        };
        this.deleteBook = this.deleteBook.bind(this);
    }
    deleteBook() {
        this.setState({
            loading: true,
            message: null
        });
        Ajax.delete(`/booksApi/${this.props.id}`, (err, res) => {
            if (err) {
                this.setState({
                    loading: false,
                    message: "Error sending request"
                });
            } else {
                if (res.error) {
                    this.setState({
                        loading: false,
                        message: "Sorry, an error occurred"
                    });
                } else {
                    this.setState({
                        loading: false,
                        message: "Success!"
                    });
                    window.location.reload(true);
                }
            }
        });
    }
    render() {
        return (
            <div>
                <Button colored onClick={this.deleteBook}>Remove Book</Button>
                {(this.state.loading) ? <Spinner singleColor /> : null}
                {this.state.message}
            </div>
        );
    }
}

class RequestBookButton extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <Button colored onClick={this.requestBook}>Request Book</Button>
            </div>
        );
    }
}

const buttonTypes = {
    AddBook: AddBookButton,
    DeleteBook: DeleteBookButton,
    RequestBook: RequestBookButton
};

