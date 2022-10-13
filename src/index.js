import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";


import App from "./App";
import * as serviceWorker from "./serviceWorker";

import packageJSON from './../package.json'

window.newrelic.addRelease('App Version',packageJSON.version);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();