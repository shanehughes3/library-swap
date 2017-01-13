import React from "react";
import {Card, CardTitle, CardText,
        CardActions, CardMenu, Button, Spinner} from "react-mdl";
import {Ajax} from "./ajax";

export class BooksDisplay extends React.Component {
    constructor() {
        super();
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
                                                "no-repeat center" }:
                                                {}
                            } />
                        <CardText>
                            {book.title || ""} {(book.authors) ?
                                                  "- " + book.authors[0] : ""}
                        </CardText>
                        <CardActions border>
                            {cardButton}
                        </CardActions>
                        
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
        Ajax.get("/add", `?id=${this.props.id}`, (err, res) => {
            if (err) {
                this.setState({
                    loading: false,
                    message: "Error sending request"
                });
            } else {
                res = JSON.parse(res);
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
        Ajax.get("/delete", `?id=${this.props.id}`, (err, res) => {
            if (res.error) {
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

const buttonTypes = {
    AddBook: AddBookButton,
    DeleteBook: DeleteBookButton
};

