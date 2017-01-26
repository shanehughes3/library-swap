import React from "react";
import {Card, CardTitle, CardText, CardActions, CardMenu, Button, Spinner,
        Tooltip, Icon, Dialog, DialogTitle, DialogContent,
        DialogActions} from "react-mdl";
import {SelectField, Option} from "react-mdl-extra";
import {Ajax} from "./ajax";

export class BooksDisplay extends React.Component {
    constructor() {
        super();
        this.state = {
            userBooks: []
        };
    }

    componentWillMount() {
        if (this.props.button == "RequestBook") {
            Ajax.get("/api/books/user", (err, res) => {
                if (err) {
                    console.log(err); //////////////
                } else {
                    this.setState({
                        userBooks: res.books
                    });
                }
            });
        }
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
                            id={book.id}
                            title={book.title}
                            userBooks={this.state.userBooks} />
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
        Ajax.post("/api/books", {id: this.props.id}, (err, res) => {
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
        Ajax.delete(`/api/books/${this.props.id}`, (err, res) => {
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
        this.state = {
            openDialog: false,
            offerBook: 0,
            message: "",
            loading: false
        };
        this.handleOpenDialog = this.handleOpenDialog.bind(this);
        this.handleCloseDialog = this.handleCloseDialog.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
    }

    handleOpenDialog() {
        this.setState({
            openDialog: true
        });
    }

    handleCloseDialog() {
        this.setState({
            openDialog: false
        });
    }

    handleSelect(e) {
        console.log(e);
        this.setState({
            offerBook: e.target.value
        });
    }

    handleSubmit() {
        if (this.state.offerBook === 0) {
            this.setState({
                message: "You must select a book to offer"
            });
        } else {
            const payload = {
                offerBookId: this.state.offerBook,
                requestedBookId: this.props.id
            };
            Ajax.post("/api/requests", payload, this.handleResponse);
            this.setState({
                message: "",
                loading: true
            });
        }
    }

    handleResponse(err, res) {
        if (err) {
            this.setState({
                message: "Sorry, an error occurred",
                loading: false
            });
        } else {
            if (res.error) {
                this.setState({
                    message: res.error,
                    loading: false
                });
            } else {
                this.setState({
                    message: "Success!",
                    loading: false
                });
                window.location.href = `/requests/view/${res.id}`;
            }
        }
    }

    render() {
        let options;
        if (this.props.userBooks) {
            options = this.props.userBooks.map((book) => {
                return (
                    <option value={book.id} key={book.id} >
                        {book.title}
                    </option>
                );
            });
        }
        return (
            <div>
                <Button colored onClick={this.handleOpenDialog}>
                    Request Book
                </Button>
                <Dialog
                    open={this.state.openDialog}
                    onCancel={this.handleCloseDialog}>
                    <DialogTitle>Request "{this.props.title}"</DialogTitle>
                    <DialogContent>
                        <label htmlFor="offerBook">
                            Book to offer:
                        </label>
                        <select
                            value={this.state.offerBook}
                            onChange={this.handleSelect}
                            name="offerBook">
                            <option
                                disabled
                                value="0"
                                style={{display: "none"}} >
                                -- select an option --
                            </option>
                            {options}
                        </select>
                        <Button
                            raised color ripple
                            onClick={this.handleSubmit} >
                            Request
                        </Button>
                        <Button
                            raised color ripple
                            onClick={this.handleCloseDialog} >
                            Cancel
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

const buttonTypes = {
    AddBook: AddBookButton,
    DeleteBook: DeleteBookButton,
    RequestBook: RequestBookButton
};

