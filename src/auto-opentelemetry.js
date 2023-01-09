import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

import { ZoneContextManager } from '@opentelemetry/context-zone';
// const { ZoneContextManager } = await import("@opentelemetry/context-zone");

const collectorString = "https://otlp.nr-data.net:4318/v1/traces";
const provider = new WebTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "react-tutorials-otel",
  }),
});

//consoleExporter for debugging
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new OTLPTraceExporter({
      url: collectorString || "http://localhost:4318/v1/traces",
      headers: {
        "api-key": "f5644626eef13f26d27746c6e381555ef9f9NRAL",
      },
    })
  )
);

const contextManager = new ZoneContextManager();

provider.register({
  contextManager: new ZoneContextManager(),
  propagator: new CompositePropagator({
    propagators: [new W3CBaggagePropagator(), new W3CTraceContextPropagator()],
  }),
});
const autoOtelTracer = async (collectorString) => {
  console.error(`Registering auto Otel ${new Date().getMilliseconds()}`);

  registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        // load custom configuration for xml-http-request instrumentation
        '@opentelemetry/instrumentation-xml-http-request': {
          ignoreUrls:['/localhost:8081/sockjs-node'],
          propagateTraceHeaderCorsUrls: [
              /.+/g,
            ],
        },
        // load custom configuration for fetch instrumentation
        '@opentelemetry/instrumentation-fetch': {
          propagateTraceHeaderCorsUrls: [
              /.+/g,
            ],
        },
      }),
    ],
   })
  // registerInstrumentations({
  //   tracerProvider: provider,
  //   instrumentations: [
  //     getWebAutoInstrumentations({
  //       "@opentelemetry/instrumentation-fetch": {
  //         ignoreUrls: ["/localhost:8081/sockjs-node"],
  //         propagateTraceHeaderCorsUrls: [
  //           "http://localhost:8080",
  //           "http://3.230.230.121",
  //         ],
  //         clearTimingResources: true,
  //       },
  //     }),
  //   ],
  // });
};

export { autoOtelTracer };
