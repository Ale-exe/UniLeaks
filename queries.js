const {hash, verify} = require('./hashing');

const pool = require('./databaseConnection');

// Gets all fields from posts table - used in load posts to load existing posts on screen
const getAllPosts = (req, res) => {
    pool.query('SELECT * FROM dss.blogposts ORDER BY date ASC, time ASC', (err, result) => {
        // if records are available, return successful status else, return unsuccessful message
        if(result.rows.length > 0){
            res.status(201).json(result.rows);
        } else {
            res.status(200).json(result.rows);
        }
    });
}

const getPostById = (req, res) => {
    const id = req.body.id;
    pool.query('SELECT * FROM dss.blogposts WHERE postid = $1', [id], (err, result) => {
        // if records are available, return successful status else, return unsuccessful message
        if(result.rows.length > 0){
            res.status(201).send({status: 201, result: result.rows});
        } else {
            res.status(200).send({status: 200, message: 'Post could not be edited, please refresh the page and try again'});
        }
    });
}

// Checks if username/ password match those stored in the user table
const checkUserCredentials = (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    // If the username exists in the database - compare user entered password with the hash in the DB using verify function
    pool.query("select bloggerpassword from dss.bloguser WHERE bloggerusername = $1", [username], (err, result) => {

        if(result.rows.length > 0){
            try{
                verify(result.rows[0].bloggerpassword, password).then(data => {
                    if(data){
                        // authenticate session
                        req.session.authenticated = true;

                        // Delete any previous sessions from the session database
                        pool.query("DELETE FROM dss.session", (error, result) => {
                                if (err) throw err;
                            })

                        try { // Hashing the username with argon2 to create the session id and store it in database
                            hash(username).then(sessionHash => {

                                pool.query("INSERT INTO dss.session (bloggerusername, bloggersessionhash) VALUES ($1, $2)",
                                    [username, sessionHash], (error, result) => {
                                        if (err) throw err;
                                        // assign the current user in server session storage
                                        req.session.user = {sessionHash};

                                        res.status(201).send({status:201,session:req.session});
                                    })
                            });
                        } catch (err){
                            res.status(200).send({status:200 , message: "Could not hash session ID"});
                        }
                    } else{
                        res.status(200).send({status:200, message:"Incorrect username or password"});
                    }
                })
            } catch(err){
                res.status(200).send({status:200, message: "Server error, please try again later"});
            }
        } else {
            res.status(200).send({status:200, message:"Incorrect username or password"});
        }
    })
}

const createAccount = (req, res) => {

    const username = req.body.username
    const password = req.body.password;
    const email = req.body.email;

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

    // check if username or email exists already
    pool.query('SELECT * FROM dss.bloguser WHERE bloggerusername = $1 OR bloggeremail = $2',
        [username, email], (err, result) => {
            // if exists - send back generic error so its not known if username or email already exists
            if (result.rows.length > 0) {
                res.status(200).send({status: 200, message: "Please use different combination of username, password and email"});
            } else {
                // if doesn't exist, then create account and hash password using Argon2 hashing algorithm and input data in db
                try{
                    const hashedPwd = hash(password).then(value => {
                    pool.query("insert into dss.bloguser (bloggerusername, bloggerpassword, bloggeremail) Values ($1,$2,$3)",
                    [username,value,email], (err,result) =>{
                        if(err) throw err;
                        else {
                            res.status(201).send({status: 201, message: "Account created"});
                    }})
                });
                } catch(err){
                    res.status(200).send({status:200, message:err.toString()});
                }
            }
        })
}


// Checks if user exists in database then adds post content to posts table
const postContent = (req, res) => {

    const username = req.body.username;
    const title = req.body.blogtitle;
    const body = req.body.blogbody;
    const filepath = req.body.path;

    if(title.includes('<') || body.includes('>'))
    {
        res.status(200).send({status:200, message:"This type of content is not permitted"});
        return;
    }

    // First checks if user exists in database by comparing their username to database
    pool.query('SELECT bloggerid FROM dss.bloguser WHERE bloggerusername = $1',
        [username], (err, result) => {
            // Gets user ID
            const id = parseInt(result.rows[0].bloggerid);

            // If there is a user with this username, create post in posts table
            if(result.rows.length > 0){
                pool.query('INSERT INTO dss.blogposts(bloguserid, blogusername, title, body, filepath) VALUES ($1,$2,$3,$4,$5)',
                    [id, username, title, body, filepath], (err, result) => {
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

const searchPosts = (req, res) => {
    let searchTerm = req.body.searchterm;

    // select all post titles and bodies that include the searchterm
    pool.query("SELECT * FROM dss.blogposts WHERE (LOWER(title) LIKE LOWER('%" + searchTerm + "%')) OR LOWER(body) LIKE LOWER('%" + searchTerm + "%')", (err, result) => {
            console.log(result.rows);
            res.status(201).json(result.rows);
    });
}

const updatePost = (req, res) => {
    console.log("in updatePost");
    console.log(req.body);
    const id = req.body.id;
    const title = req.body.blogtitle;
    const body = req.body.blogbody;
    const file = req.body.file;

    if(file !== ''){
        pool.query('UPDATE dss.blogposts SET title = $1, body = $2, filepath = $3 WHERE postid = $4',
            [title, body, file, id], (error, result) => {
                console.log(result.rows)
                if (result.rows > 0){
                    res.status(201).send(result.rows);
                } else{
                    res.status(200).send(result.rows);
                }
            })
    } else {
        pool.query('UPDATE dss.blogposts SET title = $1, body = $2 WHERE postid = $3',
            [title, body, id], (error, result) => {
                console.log(result.rows)
                if (result.rows > 0){
                    res.status(201).send(result.rows);
                } else{
                    res.status(200).send(result.rows);
                }
            })
    }
}

// If session memory contains user, compare session to hashed id in the database, returning successful if they match
const getSession = (req, res) => {
    // if the session store contains a user
    if(req.session.user !== undefined){
        // hashed session id
        let activeSession = req.session.user.sessionHash

        // compare hashed session store id with the session id in the database - if they match, return username
        pool.query('SELECT bloggerusername FROM dss.session WHERE bloggersessionhash = $1',
            [activeSession],
            (error, result) => {
                if (result.rows.length > 0){
                    console.log(result.rows)
                    res.status(201).send({status:201, result:result.rows[0]});
                } else {
                    console.log("no session found")
                    res.status(200).send({status:200, message:'No session found'})
                }
            })
    } else {
        console.log("no user logged in!")
        res.status(200).send({status: 200, message:'No session active'})
    }
}

const deleteSession = (req, res) => {
    let username = req.body.username;

    pool.query("DELETE FROM dss.session WHERE bloggerusername = $1", [username], (error, result) => {
        if (error) throw error;
        res.status(201).send({status:201});
    })
}


module.exports = {
    getAllPosts,
    getPostById,
    checkUserCredentials,
    createAccount,
    postContent,
    deletePost,
    searchPosts,
    getSession,
    deleteSession,
    updatePost
}