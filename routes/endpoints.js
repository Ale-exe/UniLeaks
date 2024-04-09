const express = require('express');
const queries = require('../queries');
const misc = require('../public/javascripts/jsonHandler');
const upload = require('../public/javascripts/fileUpload');
let endpoint_router = express.Router();

// blogpost queries
endpoint_router.get('/posts/getallposts', queries.getAllPosts);

endpoint_router.post('/posts/postcontent', queries.postContent);

endpoint_router.post('/posts/deletepost', queries.deletePost);


// user queries
endpoint_router.post('/users/checkcredentials', queries.checkUserCredentials);

endpoint_router.post('/users/createaccount', queries.createAccount);

endpoint_router.post('/users/readencryptedpassword', queries.readEncryptedPassword);


// non-query endpoints
endpoint_router.post('/editJSON',misc.writeEditJSONFile);

endpoint_router.post('/getkeyfromJSON',misc.getKeyFromJSON);

endpoint_router.post('/storefileupload',upload.storeFileUpload);

endpoint_router.post('/editJSONPasswords', misc.writeEditJSONFilePasswords);

endpoint_router.post('/users/readJSONPasswordKeys', misc.readPasswordKeyFromJSON);

// search

endpoint_router.post('/searchposts', queries.searchPosts);

module.exports = endpoint_router;