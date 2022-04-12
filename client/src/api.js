import axios from "axios";

export default axios.create({
  baseURL: `http://20.93.154.247:8080`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
