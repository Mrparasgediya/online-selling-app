import axios, { Axios } from "axios";

const API: Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://arth-creation.vercel.app"
      : "http://localhost:3000",
});

export default API;
