require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

//JSON and FormData received
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
const router = require("./routes/Router.js");

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
