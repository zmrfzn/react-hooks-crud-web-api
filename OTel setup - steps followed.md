# OTel setup - steps followed

```npm install @opentelemetry/api \
  @opentelemetry/sdk-trace-web \
  @opentelemetry/instrumentation-document-load \
  @opentelemetry/context-zone
```

## Create opentelemetry.js 
copy paste the sample snippet from official otel docs for `document-load.js` 

```
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';

const provider = new WebTracerProvider();

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [
    new DocumentLoadInstrumentation(),
  ],
});
```


## Add exporters

for console 
```
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
```

## **IMPORTANT** Collector is NOT REQUIRED
Setting up collector & OTLP exporter. This also setups the exporting to newrelic via the OTLP. 
The following envvars overrides the default OTEL endpoints and points to New Relic

```export OTEL_EXPORTER_OTLP_ENDPOINT=https://otlp.nr-data.net
export NEW_RELIC_LICENSE_KEY=f5644626eef13f26d27746c6e381555ef9f9NRAL
```


Run the Docker for the OTel collector with a sample configuration from [New Relic](https://docs.newrelic.com/docs/more-integrations/open-source-telemetry-integrations/opentelemetry/collector/opentelemetry-collector-basic/)

Docker run command 
```
docker run --rm \
  -e OTEL_EXPORTER_OTLP_ENDPOINT \
  -e NEW_RELIC_LICENSE_KEY \
  -p 4317:4317 \
  -p 4318:4318 \
  -v "${PWD}/otel-config.yaml":/otel-config.yaml \
  --name otelcol \
  otel/opentelemetry-collector \
  --config otel-config.yaml
```

The above steps are not necessary, as newrelic has an API that supports OTLP data ingest.

## Configure OTLP exporter 

```
provider.addSpanProcessor(new SimpleSpanProcessor(new OTLPTraceExporter({
    url:'https://otlp.nr-data.net:4318/v1/traces',
    headers: {
        'api-key' : '<YOUR NR LICENSE>'
    }
})));
```

[Read more about New relic endpoints](https://docs.newrelic.com/docs/more-integrations/open-source-telemetry-integrations/opentelemetry/opentelemetry-setup/#review-settings)