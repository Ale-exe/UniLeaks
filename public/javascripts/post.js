// loads posts on home page
async function loadPosts(){
    // gets username of logged in user
    const username = await getSession();
    let csrfToken = '';
        // fetches from endpoint 'getallposts' (gets all posts from database)
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    await fetch('/posts/getallposts', {
         'x-csrf-token': csrfToken
    })
        .then(response => response.json())
        .then(data => {
            const postArray = Object.entries(data);

            // For each array entry, create a "card" to hold data
            for (let i = 0; i < postArray.length; i++){

                // Dynamically create cards for each row of data from the post table
                const postCard = document.createElement('div');
                postCard.setAttribute('class','card my-4');
                // post id set to id of post in database
                postCard.setAttribute('id',`${postArray[i][1].postid}`);
                const postCardImage = document.createElement('img');
                if (postArray[i][1].filepath) {
                    postCardImage.setAttribute('class', 'card-img-top');
                    postCardImage.setAttribute('src', src='images/'+postArray[i][1].filepath);
                }
                postCardImage.style.justifySelf = 'center';
                postCardImage.style.height = '40%';
                postCardImage.style.width = '40%';
                postCardImage.style.display = 'block';
                postCardImage.style.marginLeft = 'auto';
                postCardImage.style.marginRight = 'auto';

                const postCardBody = document.createElement('div');
                postCardBody.setAttribute('class','card-body');
                const postCardTitle = document.createElement('h4');
                postCardTitle.textContent = decodeOutput(postArray[i][1].title);
                const postCardMainText = document.createElement('p');
                postCardMainText.textContent = decodeOutput(postArray[i][1].body);
                const postOptions = document.createElement('div');
                postOptions.setAttribute('class','d-flex');
                const author = document.createElement('p');
                author.textContent = `Author: ${postArray[i][1].blogusername}`;


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

                // IF user logged on matches post author then render delete and edit button
                if(username !== undefined) {
                    if (username === postArray[i][1].blogusername) {
                        const deletePostButton = document.createElement('p');
                        deletePostButton.textContent = 'Delete Post';
                        deletePostButton.style.color = 'blue';
                        deletePostButton.setAttribute('class','ms-3');

                        deletePostButton.addEventListener('click', () => {
                            deletePost(postArray[i][1].postid);
                        })

                        const editPostButton = document.createElement('p');
                        editPostButton.textContent = 'Edit Post';
                        editPostButton.style.color = 'blue';
                        editPostButton.setAttribute('class', 'ms-auto');

                        editPostButton.setAttribute("data-bs-toggle", "offcanvas");
                        editPostButton.setAttribute("href", "#offcanvasEdit");
                        editPostButton.setAttribute("role", "button");
                        editPostButton.setAttribute("data-bs-title", "Edit product");


                        editPostButton.addEventListener('click', () => {
                            editPostContent(postArray[i][1].postid)
                        })
                        postOptions.appendChild(editPostButton);
                        editPostButton.after(deletePostButton);
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

    console.log("data")
    console.log(data)

    const encodedDataTitle = encodeOutput(data.blogtitle);
    const encodeDataBody = encodeOutput(data.blogbody);

    // VALIDATION
    // If post fails the character count check then return failure
    if (!validateWordcount(data.blogtitle, data.blogbody)){
        return postErrorMessage("Please ensure posts meet character count constraints");
    }
    else if(!validatePost(data.blogtitle, data.blogbody)){
        return postErrorMessage("This type of content is not permitted");
    }
    // Check whether image has a supported file extension
    if (data.file.name !== "" && !data.file.name.match(".\(jpg|png|gif|jfif|webp)$")) {
        return postErrorMessage("Only the following file formats are permitted: jpg, png, gif, webp and jfif");
    }
    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    if (data.file.name !== "") { //if file exists
        await fetch('/storefileupload', { //upload it
            method: 'POST',
            body: formData,
            headers: {
                'Boundary': 'arbitrary-boundary',
                'x-csrf-token': csrfToken
            }
        })
            .then(res => res.json())
            .then(data => {
                filepath = data.path;
            });
    }

    let extraData = {
        // get session from database and filepath to send to
        bloggerid: data.bloggerid,
        username: await getSession(),
        path: filepath,
        blogtitle: encodedDataTitle,
        blogbody: encodeDataBody
    };

    // Append the username to the formdata from the post
    // const appendedData = Object.assign(data, extraData);

    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    await fetch('/posts/postcontent', {
        method: 'POST',
        body: JSON.stringify(extraData),
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        }
    })
        .then(response => {
            console.log(response);
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

    const delObj = {postid: id, username: await getSession()};

    let csrfToken = '';
       await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    await fetch('/posts/deletepost', {
        method: 'POST',
        body: JSON.stringify(delObj),
        headers:{
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
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

// gets post content for a specific post ID, then auto-populates content in the form
async function editPostContent(id){
     let csrfToken = '';
       await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    const postObj = {id:id}

    await fetch('/posts/getpostbyid', {
        method: 'POST',
        body: JSON.stringify(postObj),
        headers:{
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken        
        }
    })
        .then(res => res.json())
        .then(data => {
            const updateForm = document.getElementById('editPostForm');
            updateForm.postId.value = data.result[0].postid;
            // Decodes, returning symbols back to normal
            updateForm.blogtitle.value = decodeOutput(data.result[0].title);
            updateForm.blogbody.value = decodeOutput(data.result[0].body);
            updateForm.productfile.value = data.result[0].filepath;
        })
}

// Updates the database with the new details
async function updatePostContent(){
   let csrfToken = '';
       await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
    const form = document.getElementById('editPostForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);


    // Validate if post meets character constraint and that files are only jpg or png
    if (!validateWordcount(data.blogtitle, data.blogbody)){
        return postEditErrorMessage("Please ensure posts meet character count constraints");
    }
    if (data.postimage.name !== "" && !data.postimage.name.match(".\(jpg|png|gif)$")) {
        return postEditErrorMessage("Only the following file formats are permitted: jpg, png and gif");
    }

    formData.append('file', data.postimage.name);

    // replaces post title and body with encoded version
    formData.set('blogtitle',encodeOutput(data.blogtitle));
    formData.set('blogbody',encodeOutput(data.blogbody));

    let newFileName = '';

    // Upload file
    if (data.postimage.name !== "") {
        await fetch('/posts/updatepic', {
            method: 'POST',
            body: formData,
            headers: {'x-csrf-token': csrfToken},

        })
            .then(res => res.json())
            .then(data => {
                console.log("Data path")
                console.log(data.path)
                newFileName = data.path;
            })
    }

    // Append edited filename
    const appendedData = Object.assign({},data,{
        file: newFileName,
        blogtitle: encodeOutput(data.blogtitle),
        blogbody: encodeOutput(data.blogbody)
    })

    console.log(appendedData)

    // Update post data in database
    await fetch('/posts/updatepost', {
        method: 'POST',
        body: JSON.stringify(appendedData),
        headers:{
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        }

    })
        .then(res => res.json())
        .then(data => {
            window.location.reload();
        })

}