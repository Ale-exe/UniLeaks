const express = require('express');
const queries = require('../queries');
const misc = require('../archive/jsonHandler');
const upload = require('../public/javascripts/fileUpload');
const helper = require('../public/javascripts/helperFunctions');
let endpoint_router = express.Router();
const session = require('express-session');
const multer = require('multer');
const textToImage = require('text-to-image');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileUpload = multer({ storage: storage });

const {csrfSync} = require('csrf-sync');

const {
  invalidCsrfTokenError, // This is just for convenience if you plan on making your own middleware.
  generateToken, // Use this in your routes to generate, store, and get a CSRF token.
  getTokenFromRequest, // use this to retrieve the token submitted by a user
  getTokenFromState, // The default method for retrieving a token from state.
  storeTokenInState, // The default method for storing a token in state.
  revokeToken, // Revokes/deletes a token by calling storeTokenInState(undefined)
  csrfSynchronisedProtection, // This is the default CSRF protection middleware.
} = csrfSync();

// blogger session setup - session stays active for an hour
endpoint_router.use(session({secret: 'sessionsecret', cookie: {maxAge: 3600000}, saveUninitialized: false, resave: true}));

endpoint_router.get("/csrf-token", (req, res) => res.json({token:generateToken(req)}));
endpoint_router.use(csrfSynchronisedProtection);

// blogpost queries
endpoint_router.get('/posts/getallposts', queries.getAllPosts);

endpoint_router.post('/posts/getpostbyid', queries.getPostById);

endpoint_router.post('/posts/postcontent', queries.postContent);

endpoint_router.post('/posts/deletepost', queries.deletePost);

endpoint_router.post('/posts/updatepost', fileUpload.single('postimage'), queries.updatePost, (req,res) =>{
    res.json({ message: 'File uploaded successfully!', path : req.file});
});

endpoint_router.get("/generate-captcha", (req, res) => {
       const key = helper.randomKey(6);

            const captcha = textToImage.generate(key, {

            }).then(function(dataUri){
                req.session.captchaKey = key;
                res.json({uri: dataUri})
                console.log(req.session);
            });
        }
    
    
    
);

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

