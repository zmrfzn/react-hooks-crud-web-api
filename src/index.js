import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";


import App from "./App";
import * as serviceWorker from "./serviceWorker";

import packageJSON from './../package.json'

// OTEL
import { startOtelInstrumentation } from './opentelemetry';
// import { autoOtelTracer } from './auto-opentelemetry';

// const OTEL_NR_ENDPOINT = 'https://otlp.nr-data.net:4318/v1/traces'

// window.newrelic.addRelease('App Version',packageJSON.version);

startOtelInstrumentation();
// autoOtelTracer(OTEL_NR_ENDPOINT);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();

