import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import * as otelApi from "@opentelemetry/api";

import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

import { B3Propagator } from "@opentelemetry/propagator-b3";
import {
  CompositePropagator,
  W3CBaggagePropagator,
  W3CTraceContextPropagator,
} from "@opentelemetry/core";

import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { XMLHttpRequestInstrumentation } from "@opentelemetry/instrumentation-xml-http-request";
import { FetchInstrumentation } from "@opentelemetry/instrumentation-fetch"
import { registerInstrumentations } from "@opentelemetry/instrumentation";

//exporters
import {
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const startOtelInstrumentation = () => {
  const providerConfig = {
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "react-tutorials-otel",
    }),
  };
  const provider = new WebTracerProvider(providerConfig);

  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  // provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

  // provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
  //     url:'http://localhost:4318/v1/traces'
  // })));
  provider.addSpanProcessor(
    new BatchSpanProcessor(
      // OTLP Configurations
      new OTLPTraceExporter({
        url: "https://otlp.nr-data.net:4318/v1/traces",
        headers: {
          "api-key": `${process.env.NR_LICENSE}`,
        },
      }),
      // BatchSpanProcessor Configurations
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
    // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
    contextManager: new ZoneContextManager().enable(),
    propagator: new CompositePropagator({
      propagators: [
        new W3CBaggagePropagator(),
        new W3CTraceContextPropagator(),
        new B3Propagator(),
      ],
    }),
  });

  // const baggage =   otelApi.propagation.getBaggage(otelApi.context.active()) || otelApi.propagation.createBaggage();
  // debugger;
  // baggage.setEntry("sessionId", { value: "session-id-value" });
  // otelApi.propagation.setBaggage(otelApi.context.active(), baggage);

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
      // new FetchInstrumentation({
      //   clearTimingResources: true,
      //   propagateTraceHeaderCorsUrls: [
      //     /http:\/\/localhost:\d+\.*/
      //   ]
      // })
    ],
  });
};

export { startOtelInstrumentation };
