import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";


import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";

import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { registerInstrumentations } from "@opentelemetry/instrumentation";

//exporters
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const collectorString = "https://otlp.nr-data.net:4318/v1/traces";
const provider = new WebTracerProvider({
resource: new Resource({
  [SemanticResourceAttributes.SERVICE_NAME]: "react-tutorials-otel",
}),
});

//consoleExporter for debugging
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.addSpanProcessor(
new BatchSpanProcessor(
  new OTLPTraceExporter({
    url: collectorString || "http://localhost:4318/v1/traces",
    headers: {
      "api-key": "f5644626eef13f26d27746c6e381555ef9f9NRAL",
    },
  }),
   //BatchSpanProcessor Configurations
    {
      // The maximum queue size. After the size is reached spans are dropped.
      maxQueueSize: 100,
      // The maximum batch size of every export. It must be smaller or equal to maxQueueSize.
      maxExportBatchSize: 50,
      // The interval between two consecutive exports
      scheduledDelayMillis: 500,
      // How long the export can run before it is canceled
      exportTimeoutMillis: 30000,
    }
)
);

provider.register({
contextManager: new ZoneContextManager(),
propagator: new CompositePropagator({
  propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
}),
});

// const baggage =   otelApi.propagation.getBaggage(otelApi.context.active()) || otelApi.propagation.createBaggage();
// debugger;
// baggage.setEntry("sessionId", { value: "session-id-value" });
// otelApi.propagation.setBaggage(otelApi.context.active(), baggage);

const startOtelInstrumentation = () => {
  console.error(`Registering Otel ${new Date().getMilliseconds()}`);
  // Registering instrumentations
  registerInstrumentations({
    instrumentations: [
      new DocumentLoadInstrumentation(),
      new XMLHttpRequestInstrumentation({
        ignoreUrls: ["/localhost:8081/sockjs-node"],
        clearTimingResources: true,
        propagateTraceHeaderCorsUrls: [
          /http:\/\/localhost:\d+\.*/
        ],
      }),
      new UserInteractionInstrumentation({eventNames: ["click","load",
      "loadeddata",
      "loadedmetadata",
      "loadstart","error"]})
    ],
  });
};

export { startOtelInstrumentation };
