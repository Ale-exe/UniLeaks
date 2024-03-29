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
//Input validation for the sign up form
function validateRegisterForm(){
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    const email = document.getElementById('inputEmail').value.trim();

    if(username.length <= 0){
        document.getElementById("usernameMsg").innerHTML = "Please enter a username";
        return false;
    }    
    if(password.length <= 0) {
        document.getElementById("passwordMsg").innerHTML = "Please enter a password"
        return false;
    }
    if(password.length < 12) {
        document.getElementById("passwordMsg").innerHTML = "Password length must be at least 12 characters long";
        return false; 
    }
    if(!(/[a-z]/.test(password))){
        document.getElementById("passwordMsg").innerHTML = "Password must contain a lower case character";
        return false;
    }
    if(!(/[A-Z]/.test(password))){
        document.getElementById("passwordMsg").innerHTML = "Password must contain an upper case character";
        return false;
    }
    if(!(/\d/.test(password))){
        document.getElementById("passwordMsg").innerHTML = "Password must contain a number";
        return false;
    }
    if(!(/[#.?!@$%^&*-]/.test(password))){
        document.getElementById("passwordMsg").innerHTML = "Password must contain a special character: #.?!@$%^&*-";
        return false;
    }  
    if(!(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email))){
        document.getElementById("emailMsg").innerHTML = "Please enter a valid email address";
        return false;
    }
    return true;
}