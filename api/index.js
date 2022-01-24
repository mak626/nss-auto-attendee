const { default: axios } = require("axios");
require("dotenv").config();

const api = axios.create({
  baseURL: process.env.BASEURL,
  headers: {
    cookie: process.env.TOKEN,
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
const pageLimit = 5000;

module.exports = { api, pageLimit };
