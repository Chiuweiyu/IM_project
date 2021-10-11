// load env var
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const cors = require("cors");
const app = express();

// using gzip for better performance
app.use(compression());

// allowing CORS
app.use(cors());

// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// logger
app.use(morgan("dev"));

// central router
const apiRouter = require("./routes/apiRouter");
app.use("/", apiRouter);

module.exports = app;