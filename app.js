require('dotenv').config()

const express = require('express');
const app = express();
const port = 5000;
const html = require("./routes/htmlRouter.js");
const endpoints = require('./routes/endpoints.js');
app.use(express.json());

// JS/CSS/Image handled statically
app.use('/static', express.static('public/javascripts'));
app.use('/static', express.static('public/stylesheets'));
app.use('/Images', express.static('public/images'));

app.use("/", html);
app.use("/", endpoints);

app.listen(port, () => console.log(`Express app listening on port ${port}...`));