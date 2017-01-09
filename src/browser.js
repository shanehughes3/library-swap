"use strict"

import React from "react";
import ReactDOM from "react-dom";
import {Index} from "./index.jsx";

const apps = {
    "home-app": Index
};

function renderApp(element) {
    const App = apps[element.id];

    ReactDOM.render(<App user={window.user} />, element);
}

document.querySelectorAll(".__react-root")
        .forEach(renderApp);
