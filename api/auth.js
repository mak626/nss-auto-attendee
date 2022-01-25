require("dotenv").config();
require("colors");
const { default: axios } = require("axios");

const authApi = axios.create({
  baseURL: process.env.BASEURL,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const getAuth = async () => {
  const authRes = await authApi.get("/officer/login");
  const cookie = authRes.headers["set-cookie"][0].replace("; path=/", "");
  const res = await authApi.post(
    "/officer/login",
    new URLSearchParams({
      OFFICER_NAME: process.env.USER_NAME,
      OFFICER_PASSWORD: process.env.PASSWORD,
      REQUEST_URL: "",
      btnsubmit: "Sign+Me+In",
    }),
    {
      headers: { cookie },
    }
  );

  if (res.data.includes("Invalid username  or password")) {
    console.error("Username Or Password Is Incorrect".red.bold);
    process.exit(0);
  }
  process.env.TOKEN = cookie;
};

module.exports = { getAuth };
