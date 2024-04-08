const fs = require("fs");
const router = require('express').Router();
const bodyParser = require('body-parser');
const multer = require('multer');   

//TODO a lot of this was copied from a website so need to change to avoid plagiarism
// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
// Create the multer instance
const upload = multer({ storage: storage });

// Set up a route for file uploads
const storeFileUpload = router.post('/storefileupload', upload.single('file'), (req, res) => {
    // Return the generated file name for use by other functions
    res.json({ message: 'File uploaded successfully!', path : req.file.path});
  });

module.exports = {
    storeFileUpload
}
