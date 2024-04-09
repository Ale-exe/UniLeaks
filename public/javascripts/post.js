// loads posts on home page
async function loadPosts(){

    // fetches key from JSON
    const key = await retrieveKey('session');

    // fetches from endpoint 'getallposts' (gets all posts from database)
    await fetch('/posts/getallposts')
        .then(response => response.json())
        .then(data => {

             // Turn result into array
            const postArray = Object.entries(data);

            // For each array entry, create a "card" to hold data
            for (let i = 0; i < postArray.length; i++){
      
                // Dynamically create cards for each row of data from the post table
                const postCard = document.createElement('div');
                postCard.setAttribute('class','card my-4');
                // post id set to id of post in database
                postCard.setAttribute('id',`${postArray[i][1].postid}`);

                console.log("postArray:");
                console.log(postArray[i][1].filepath);

                const postCardImage = document.createElement('img');
                if (postArray[i][1].filepath) {
                    postCardImage.setAttribute('class', 'card-img-top');
                    postCardImage.setAttribute('src', src='images/'+postArray[i][1].filepath);
                }

                const postCardBody = document.createElement('div');
                postCardBody.setAttribute('class','card-body');

                const postCardTitle = document.createElement('h4');

                postCardTitle.textContent = encodeOutput(postArray[i][1].title);
                const postCardMainText = document.createElement('p');
                postCardMainText.textContent = encodeOutput(postArray[i][1].body);

                const postOptions = document.createElement('div');
                postOptions.setAttribute('class','d-flex');

                const author = document.createElement('p');
                author.textContent = encodeOutput(`Author: ${postArray[i][1].blogusername}`);

                // Append main card to mainContent div, then each element of the card to postcard
                document.getElementById('mainContent').appendChild(postCard);
                if (postArray[i][1].filepath) {
                    postCard.appendChild(postCardImage);
                }
                postCard.appendChild(postCardBody);
                postCardBody.appendChild(postCardTitle);
                postCardBody.appendChild(postCardMainText);
                postCardBody.appendChild(postOptions);
                postOptions.appendChild(author);

                // IF user logged on matches post author then render delete button
                if(getCookieByKey('bloggerLoggedIn') !== undefined) {
                    let username = CryptoJS.AES.decrypt(getCookieByKey('bloggerLoggedIn'), key);

                    if (username.toString(CryptoJS.enc.Utf8) === postArray[i][1].blogusername) {
                        const deletePostButton = document.createElement('p');
                        deletePostButton.textContent = 'Delete Post';
                        deletePostButton.style.color = 'blue';
                        deletePostButton.setAttribute('class', 'ms-auto');

                        deletePostButton.addEventListener('click', () => {
                            deletePost(postArray[i][1].postid);
                        })

                        postOptions.appendChild(deletePostButton);
                    }
                }
            }

        })
}

async function createPost(){
    const form = document.getElementById('postCreationForm');
    const formData = new FormData(form);

    let filepath = "";
    
    const data = Object.fromEntries(formData);

    // If post fails the character count check then return failure
    if (!validateWordcount(data.blogtitle, data.blogbody)){
        return postErrorMessage("Please ensure posts meet character count constraints");
    }
    else if(!validatePost(data.blogtitle, data.blodybody)){
        return postErrorMessage("This type of content is not permitted");
    }

    await fetch('/storefileupload', {
        method: 'POST',
        body: formData,
        headers: {
            'Access-Control-Allow-Headers':'*',
            'Boundary': 'arbitrary-boundary'
        }
    })
        .then(res => res.json())
        .then(data => {
            filepath = data.path;
        });

    const key = await retrieveKey('session');
    // Decrypt session cookie before passing it to backend
    let username = CryptoJS.AES.decrypt(getCookieByKey('bloggerLoggedIn'),key);
    let extraData = {       
        username: username.toString(CryptoJS.enc.Utf8),
        path: filepath
    };

    // Append the username to the formdata from the post
    const appendedData = Object.assign(data, extraData);

    await fetch('/posts/postcontent', {
        method: 'POST',
        body: JSON.stringify(appendedData),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers':'*'
        }
    })
        .then(response => {
            if (response.status === 201){
                // If successful, reload to show new post
                window.location.reload();

            }  else{
                // TODO: Create error message
                console.log("failure");
            }
        })
}

// Deletes post using the passed post id
async function deletePost(id){
    const key = await retrieveKey('session');

    let username = CryptoJS.AES.decrypt(getCookieByKey('bloggerLoggedIn'),key);
    const delObj = {postid: id, username: username.toString(CryptoJS.enc.Utf8)};

    await fetch('/posts/deletepost', {
        method: 'POST',
        body: JSON.stringify(delObj),
        headers:{
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers':'*'
        }
    })
        .then(response => {
            if (response.status === 201){
                // If delete successful, reload
                window.location.reload();
            }  else{
                // TODO: Create error message
                console.log("failure");
            }
        })
}