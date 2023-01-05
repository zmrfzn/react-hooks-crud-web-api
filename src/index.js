import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";


import App from "./App";
import * as serviceWorker from "./serviceWorker";

import packageJSON from './../package.json'

// OTEL
import { startOtelInstrumentation } from './opentelemetry';

// window.newrelic.addRelease('App Version',packageJSON.version);

startOtelInstrumentation();
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();

