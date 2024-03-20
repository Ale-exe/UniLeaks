// Validates create post form to ensure it doesn't go over or under character limit
function validateWordcount(postTitle, postBody){
    if (postTitle.trim().length < 1 || postBody.trim().length < 1){
        return false;
    } else if (postTitle.trim().length > 50){
        return false;
    } else if (postBody.trim().length > 500){
        return false;
    } else {
        return true;
    }
}