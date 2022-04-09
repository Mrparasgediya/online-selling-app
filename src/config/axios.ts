import axios, { Axios } from "axios";

const API: Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.APP_BASE_URL,
});

export default API;
