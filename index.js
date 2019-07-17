const mongoose = require("mongoose");
const express = require("express")
const bodyParser = require("body-parser")
const jwt = require('express-jwt');

const Schema = mongoose.Schema;

const app = express()
const port = 4000

mongoose.connect("mongodb://localhost/usersdb");
mongoose.connection.on("error", err => console.log(err))

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(require("./routes"))

app.listen(port, () => console.log(`Server is listening on port ${port}`))
