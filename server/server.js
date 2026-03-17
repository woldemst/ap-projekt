require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const app = express();

mongoose
    .connect(DB_URL)
    .then(() => {
        app.listen(PORT, "0.0.0.0");
        console.log(`The server is working on the port ${PORT}`);
    })
    .catch((err) => {
        console.log(`Error if connecting ${err.message}`);
    });
