import axios, { Axios } from "axios";

const API: Axios = axios.create({
  baseURL: process.env.APP_BASE_URL,
});

export default API;
