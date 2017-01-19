"use strict"

import React from "react";
import ReactDOM from "react-dom";
import {Index} from "./index.jsx";
import {Books} from "./books.jsx";
import {Requests} from "./requests.jsx";

const apps = {
    "home-app": Index,
    "my-books": Books,
    "requests": Requests
};

function renderApp(element) {
    const App = apps[element.id];

    ReactDOM.render(<App user={window.user} />, element);
}

document.querySelectorAll(".__react-root")
        .forEach(renderApp);
