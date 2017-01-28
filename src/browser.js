"use strict"

import React from "react";
import ReactDOM from "react-dom";
import {Index} from "./index.jsx";
import {Books} from "./books.jsx";
import {Requests} from "./requests.jsx";
import injectTapEventPlugin from "react-tap-event-plugin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
injectTapEventPlugin();

const apps = {
    "home-app": Index,
    "my-books": Books,
    "requests": Requests
};

function Wrapper(props) {
    const App = apps[props.element.id];
    return (
        <MuiThemeProvider>
            <App user={props.user} />
        </MuiThemeProvider>
    );
}

function renderApp(element) {
    const App = apps[element.id];

    ReactDOM.render(<Wrapper user={window.user} element={element} />, element);
}

document.querySelectorAll(".__react-root")
        .forEach(renderApp);
