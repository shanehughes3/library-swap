import React from "react";
import {Header} from "./header.jsx";
import {Footer} from "./footer.jsx";
import {AnonLanding} from "./anon-landing.jsx";
import {SearchArea} from "./search.jsx";

export class Index extends React.Component {
    constructor() {
        super();
    }
    render() {
        const content = (this.props.user) ?
                        <SearchArea /> :
                        <AnonLanding />;
        return (
            <div>
                <Header user={this.props.user} />
                {content}
                <Footer />
            </div>
        );
    }
}
