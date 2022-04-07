import axios, { Axios } from "axios";

const API: Axios = axios.create({
  baseURL: "http://localhost:3000",
});

export default API;
