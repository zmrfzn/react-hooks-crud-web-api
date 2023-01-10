import axios from "axios";
import * as otelApi from '@opentelemetry/api';
const APIUrl = `${process.env.REACT_APP_API_URL}`


export default axios.create({
  baseURL: APIUrl,
  headers: {
    "Content-type": "application/json",
   
  }
});
