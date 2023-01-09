import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZoneContextManager } from '@opentelemetry/context-zone';

import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions'




// import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
// import { UserInteractionInstrumentation } from '@opentelemetry/instrumentation-user-interaction'
// import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";


import { registerInstrumentations } from '@opentelemetry/instrumentation';

//exporters
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

const providerConfig = {
    resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: "react-tutorials-otel"
    }),
  };
const provider = new WebTracerProvider(providerConfig);

provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
// provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter()));

// provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
//     url:'http://localhost:4318/v1/traces'
// })));
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
    url:'https://otlp.nr-data.net:4318/v1/traces',
    headers: {
        'api-key' : 'f5644626eef13f26d27746c6e381555ef9f9NRAL'
    }
})));

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager()

});


const startOtelInstrumentation = () => {
    console.error(`Registering Otel ${new Date().getMilliseconds()}`)
    // Registering instrumentations
      registerInstrumentations({
    instrumentations: [
      getWebAutoInstrumentations({
        // load custom configuration for xml-http-request instrumentation
        '@opentelemetry/instrumentation-xml-http-request': {
ignoreUrls:['/localhost:8081/sockjs-node'],
            propagateTraceHeaderCorsUrls:
            [
            'http://localhost:8080',
            'http://3.230.230.121'
            ]
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
    //   instrumentations: [
    //     new DocumentLoadInstrumentation(),
    //     new UserInteractionInstrumentation(),
    //     new XMLHttpRequestInstrumentation({
    //         ignoreUrls:['/localhost:8081/sockjs-node'],
    //         propagateTraceHeaderCorsUrls:['http://localhost:8080','http://3.230.230.121']
    //     })
    //   ],
    // });
}

export {
    startOtelInstrumentation
}