import React from "react";
import {Card, CardTitle, CardText, CardActions, CardMenu, Button} from "react-mdl";

export class BooksDisplay extends React.Component {
    constructor() {
        super();
    }
    render() {
        let cards;
        if (this.props.books) {
            cards = this.props.books.map((book) => {
                let cardButton;
                if (this.props.addToUser) {
                    cardButton = (
                        <Button colored>Add Book</Button>
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
                            style={{
                                background: `url(${book.thumbnail}) no-repeat center`
                            }} />
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

