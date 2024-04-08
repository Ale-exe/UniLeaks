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
                const postCardBody = document.createElement('div');
                postCardBody.setAttribute('class','card-body');
                const postCardTitle = document.createElement('h4');
                postCardTitle.innerText = postArray[i][1].title;
                const postCardMainText = document.createElement('p');
                postCardMainText.innerText = postArray[i][1].body;
                const postOptions = document.createElement('div');
                postOptions.setAttribute('class','d-flex');
                const author = document.createElement('p');
                author.innerText = `Author: ${postArray[i][1].blogusername}`;

                // Append main card to mainContent div, then each element of the card to postcard
                document.getElementById('mainContent').appendChild(postCard);
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
                        deletePostButton.innerText = 'Delete Post';
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
    const data = Object.fromEntries(formData);

    // If post fails the character count check then return failure
    if (!validateWordcount(data.blogtitle, data.blogbody)){
        return postErrorMessage("Please ensure posts meet character count constraints");
    }

    const key = await retrieveKey('session');

    // Decrypt session cookie before passing it to backend
    let username = CryptoJS.AES.decrypt(getCookieByKey('bloggerLoggedIn'),key);

    // Append the username to the formdata from the post
    const appendedData = Object.assign({},data,{
        username: username.toString(CryptoJS.enc.Utf8)
    })

    // file.originalname
    let string = myFile.value;
    string = string.split('\\');
    console.log(string[string.length-1]);
    // const filename = Date.now() + '-' + file.originalname;


    await fetch('/storefileupload', {
        method: 'POST',
        body: formData,
        headers: {
            'Access-Control-Allow-Headers':'*',
            'Boundary': 'arbitrary-boundary'
        }
    })
        // .then(res => res.json())
        .then(data => {
            console.log(`Data: ${data.body}`);
        });

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