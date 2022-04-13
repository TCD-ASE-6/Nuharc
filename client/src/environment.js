const API_URL =
  process.env.NODE_ENV.trim() === "production"
    ? "http://20.93.154.247:8080"
    : "http://localhost:8080";
export default API_URL;
