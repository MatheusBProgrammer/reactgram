require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const port = process.env.PORT;

const app = express();

//JSON and FormData received
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:3333" }));
//routes
const router = require("./routes/Router.js");
const exp = require("constants");
app.use(router);

// Upload path
app.use("uploads", express.static(path.join(__dirname, "/uploads")));

//DB Connection
require("./config/db.js");

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
