const pool = require('./databaseConnection');

// Gets all fields from posts table - used in load posts to load existing posts on screen
const getAllPosts = (req, res) => {
    pool.query('SELECT * FROM dss.blogposts ORDER BY date ASC, time ASC', (err, result) => {
        console.log(result.rows);

        // if records are available, return successful status else, return unsuccessful message
        if(result.rows.length > 0){
            res.status(201).json(result.rows);
        } else {
            res.status(200).json(result.rows);
        }
    });
}


const readEncryptedPassword = (req, res) => {
    const username = req.body.username; 

    pool.query('SELECT * FROM dss.bloguser WHERE bloggerusername = $1', [username], (err, result) => {
        console.log(result.rows);
        if(result.rows.length > 0){
            res.status(201).send({status:201, message:"Attempting to login", username:username});
        }
        else{
            res.status(201).send({status:201, message:"Login failed"});
        }
    })
}


// Checks if username/ password match those stored in the user table
const checkUserCredentials = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    pool.query('SELECT * FROM dss.bloguser WHERE (bloggerusername = $1 AND bloggerpassword = $2)',
        [username, password], (err, result) => {
        console.log(result.rows);

        // if records are available, return successful status else, return unsuccessful message
        if(result.rows.length > 0){
            res.status(201).send({status:201, message: "Logged in", username: username});
        } else {
            res.status(200).send({status:200, message: "Incorrect username or password"});
        }
    });
}

const createAccount = (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const encryptedPassword = req.body.encryptedPassword;

    console.log("Encrypted password: " + encryptedPassword);

    if(username.length <= 0)
    {
        res.status(200).send({status:200, message:"No username provided"});
        return;
    }
    if(password.length <= 0) {
        res.status(200).send({status:200, message:"No password provided"});
        return;
    }
    if(password.length < 12) {
        res.status(200).send({status:200, message:"Password length must be at least 12 characters long"});
        return;
    }
    if(!(/[a-z]/.test(password))){
        res.status(200).send({status:200, message:"Password must contain a lower case character"});
        return;
    }
    if(!(/[A-Z]/.test(password))){
        document.getElementById("passwordMsg").innerHTML = "Password must contain an upper case character";
        return;
    }
    if(!(/\d/.test(password))){
        res.status(200).send({status:200, message:"Password must contain a number"})
        return;
    }
    if(!(/[#.?!@$%^&*-]/.test(password))){
        res.status(200).send({status:200, message:"Password must contain a special character: #.?!@$%^&*-"})
        return;
    }  
    if(!(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email))){
        res.status(200).send({status:200, message:"Email is invalid!"});
        return;
    }

    // check if username or email exists
    pool.query('SELECT * FROM dss.bloguser WHERE bloggerusername = $1 OR bloggeremail = $2',
        [username, email], (err, result) => {
            console.log(result.rows);
            // if exists - send back generic error so its not known if username or email already exists
            if (result.rows.length > 0) {
                res.status(200).send({status: 200, message: "Please use different combination of username, password and email"});
            } else {
                // if doesn't exist, then create account
                pool.query('INSERT INTO dss.bloguser(bloggerusername, bloggerpassword, bloggeremail) VALUES ($1,$2,$3)',
                    [username,encryptedPassword,email], (err,result) =>{
                        console.log(result.rows);
                        if(err) throw err;
                        res.status(201).send({status: 201, message: "Account created"});
                    })
            }
        })
}


// Checks if user exists in database then adds post content to posts table
const postContent = (req, res) => {
    const username = req.body.username;
    const title = req.body.blogtitle;
    const body = req.body.blogbody;

    // First checks if user exists in database by comparing their username to database
    pool.query('SELECT bloggerid FROM dss.bloguser WHERE bloggerusername = $1',
        [username], (err, result) => {
            // Gets user ID
            const id = parseInt(result.rows[0].bloggerid);

            // If there is a user with this username, create post in posts table
            if(result.rows.length > 0){
                pool.query('INSERT INTO dss.blogposts(bloguserid, blogusername, title, body) VALUES ($1,$2,$3,$4)',
                    [id, username, title, body], (err, result) => {
                        console.log(result.rows);

                        if(err) throw err;
                        res.status(201).send({status:201, message: "Post created"});
                    })
            } else {
                // if the user does not exist in the database, send error - Error response is generic for security
                res.status(200).send({status:200, message: "Post was not created"});
            }
        });
}

const deletePost = (req, res) => {
    const id = parseInt(req.body.postid);
    const username = req.body.username;

    // First checks if the post exists within the database and if the logged on user did post it
    pool.query('SELECT * FROM dss.blogposts WHERE postid = $1 AND blogusername = $2',
        [id, username], (err, result) => {
            console.log(result.rows);
            // If the combination exists - delete the post
            if(result.rows.length > 0){
                pool.query('DELETE FROM dss.blogposts WHERE postid = $1 AND blogusername = $2',
                    [id, username], (err, result) => {
                    if(err) throw err;
                    res.status(201).send({status:201, message: "Post deleted"});
                })
            } else {
                // if there is no user that exists with the post - Error response is generic for security
                res.status(200).send({status:200, message: "Post was not deleted"});
            }
        });
}

module.exports = {
    getAllPosts,
    checkUserCredentials,
    createAccount,
    readEncryptedPassword,
    postContent,
    deletePost
}