const express = require('express');
const path = require('path');

let html_router = express.Router();

html_router
    .get('/', function(req, res) {
        res.sendFile((path.resolve('./public/html/blogLandingPage.html')));
    })
    .get('/login', function(req, res) {
        res.sendFile((path.resolve('./public/html/blogLoginPage.html')));
    })
    .get('/registration', function(req, res) {
        res.sendFile((path.resolve('./public/html/blogRegistrationPage.html')));
    })


module.exports = html_router;
