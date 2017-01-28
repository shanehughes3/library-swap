import React from "react";
import {Card, CardTitle, CardText, CardActions, CardMenu, RaisedButton, RefreshIndicator, FontIcon, Dialog, SelectField, MenuItem, IconButton} from "material-ui";
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
                        className="book-card">
                        <CardTitle
                            className="book-title"
                            style={(book.thumbnail) ?
                                   // prevent requests to /null or /undefined
                                   {background: `url(${book.thumbnail})` +
                                                "no-repeat center" } :
                                   {}
                                  }>
                            <IconButton
                                iconClassName="material-icons"
                                className="tooltip-icon"
                                tooltip={this.getInfo(book)}>
                                info_outline
                            </IconButton>
                        </CardTitle>
                        <CardText>
                            {book.title || ""} {(book.authors) ?
                                                "- " + book.authors[0] : ""}
                        </CardText>
                        <CardActions>
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
                <RaisedButton
                    onClick={this.addBook}
                    label="Add Book" />
            <RefreshIndicator
            status={(this.state.loading) ? "loading" : "hide"}
            left={0}
            top={0}
            />
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
                <RaisedButton
                    onClick={this.deleteBook}
                    label="Remove Book" />
                <RefreshIndicator
                    status={(this.state.loading) ? "loading" : "hide"}
                    top={0}
                    left={0} />
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
                    <MenuItem
                    value={book.id}
                    key={book.id}
                    primaryText={book.title} />
                );
            });
        }
        return (
            <div>
                <RaisedButton
                    onClick={this.handleOpenDialog}
                    label="Request Book" />
                <Dialog
                    open={this.state.openDialog}
                    onCancel={this.handleCloseDialog}>
                    <h3>Request "{this.props.title}"</h3>
                    <div>
                        <label htmlFor="offerBook">
                            Book to offer:
                        </label>
                        <SelectField
                            value={this.state.offerBook}
                            onChange={this.handleSelect}
                            name="offerBook"
                            floatingLabelText="Select an option..." >
                            {options}
                        </SelectField>
                        <RaisedButton
                            onClick={this.handleSubmit}
                            label="Request" />
                        <RaisedButton
                            onClick={this.handleCloseDialog}
                            label="Cancel" />
                    </div>
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

