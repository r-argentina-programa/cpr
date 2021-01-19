import axios from "axios";

let BASE_URL;
if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://smarket-cpr.herokuapp.com/";
} else if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:8000";
}
const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
