import React from "react";
import {Paper} from "material-ui";

export class AnonLanding extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div id="home-banner">
                    <div>
                        Find a great new book
                    </div>
                </div>
                <div id="home-middle-text">
                    Expand your horizons by trading your library
                </div>
                <div id="home-card-container">
                    <Paper zDepth={3}>
                        <div
                            style={{backgroundImage:
                                                    "url('/home-card-1.jpg')"}}
                            className="home-card-top-image" />
                        <div className="home-card-text">
                            <div>Browse</div>
                            Browse other users' books and upload the books you
                            would like to trade.
                        </div>
                    </Paper>
                    <Paper zDepth={3}>
                        <div
                            style={{backgroundImage:
                                                    "url('/home-card-2.jpg')"}}
                            className="home-card-top-image" />
                        <div className="home-card-text">
                            <div>Request</div>
                            Request a book and select one of yours to offer in
                            return.
                        </div>
                    </Paper>
                    <Paper zDepth={3}>
                        <div
                            style={{backgroundImage:
                                                    "url('/home-card-3.jpg')"}}
                            className="home-card-top-image" />
                        <div className="home-card-text">
                            <div>Swap</div>
                            Chat with the other user - if it's a good deal,
                            make a swap!
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }
}
