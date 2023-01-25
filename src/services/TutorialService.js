import http from "../http-common";
import * as otelAPI from "@opentelemetry/api";

// const otel = new otelAPI();
function traceParentIDGenerator() {
  if ( typeof(otelAPI) !== "undefined" && otelAPI !== null ) {
    let current_span = otelAPI.trace.getSpan(otelAPI.context.active());

    let trace_id = current_span.spanContext().traceId;
    let span_id = current_span.spanContext().spanId;
    let trace_flags = current_span.spanContext().traceFlags;

    return `00-${trace_id}-${span_id}-${trace_flags}`;
  } else {
    return `00-ab42124a3c573678d4d8b21ba52df3bf-d21f7bc17caa5aba-01`;
  }
}

{/* <meta name="traceparent" content="00-ab42124a3c573678d4d8b21ba52df3bf-d21f7bc17caa5aba-01"></meta> */}

const getAll = () => {
  return http.get("/tutorials");
};

const getCategories = async () => {
  const response = await http.get('/tutorials/categories')
  localStorage.setItem('categories', JSON.stringify(response.data));
  return response.data;
}

const get = id => {
  return http.get(`/tutorials/${id}`);
};

const create = data => {
  return http.post("/tutorials", data);
};

const update = (id, data) => {
  return http.put(`/tutorials/${id}`, data);
};

const remove = id => {
  return http.delete(`/tutorials/${id}`);
};

const removeAll = () => {
  return http.delete(`/tutorials`);
};

const findByTitle = title => {
  return http.get(`/tutorials?title=${title}`);
};

const findAllPublished = () => {
  return http.get(`/tutorials/published`)
}

const TutorialService = {
  getAll,
  get,
  getCategories,
  create,
  update,
  remove,
  removeAll,
  findByTitle,
  findAllPublished
};

export default TutorialService;
