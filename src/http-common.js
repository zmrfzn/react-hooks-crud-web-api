import axios from "axios";

const APIUrl = `${process.env.REACT_APP_API_URL}`

export default axios.create({
  baseURL: APIUrl,
  headers: {
    "Content-type": "application/json"
  }
});
