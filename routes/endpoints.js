const express = require('express');
const queries = require('../queries');
const misc = require('../archive/jsonHandler');
const upload = require('../public/javascripts/fileUpload');
let endpoint_router = express.Router();
const session = require('express-session');

// blogger session setup - session stays active for an hour
endpoint_router.use(session({secret: 'sessionsecret', cookie: {maxAge: 3600000}, saveUninitialized: false, resave: true}));

// blogpost queries
endpoint_router.get('/posts/getallposts', queries.getAllPosts);

endpoint_router.post('/posts/postcontent', queries.postContent);

endpoint_router.post('/posts/deletepost', queries.deletePost);


// user queries
endpoint_router.post('/users/checkcredentials', queries.checkUserCredentials);

endpoint_router.post('/users/createaccount', queries.createAccount);

// non-query endpoints
endpoint_router.post('/editJSON',misc.writeEditJSONFile);

endpoint_router.post('/getkeyfromJSON',misc.getKeyFromJSON);

endpoint_router.post('/storefileupload',upload.storeFileUpload);

// search
endpoint_router.post('/searchposts', queries.searchPosts);

module.exports = endpoint_router;

//sessions
endpoint_router.get('/getsession', queries.getSession);

endpoint_router.post('/deletesession', queries.deleteSession);
