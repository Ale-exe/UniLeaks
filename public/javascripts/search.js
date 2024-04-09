async function loadSearchedPosts(){
    let searchTerm = {searchterm:document.getElementById('blogSearch').value = getCookieByKey('bloggersearchterm')};
    const key = await retrieveKey('session');

    document.getElementById('searchResult').textContent = `Search results for: ${searchTerm.searchterm}`;

    await fetch('/searchposts', {
        method: 'POST',
        body: JSON.stringify(searchTerm),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers':'*'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 201){
                const postArray = Object.entries(data.result);
                console.log(postArray);

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

            }  else{
                console.log("failure");
            }
        })
}