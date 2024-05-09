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

//Removes illegal characters such as HTML tags
function validatePost(postTitle, postBody){
    if(postTitle.includes('<') || postTitle.includes('>'))
        return false;

    return true;
}

function validateLoginForm(){
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    
}

//Input validation for the sign up form
function validateRegisterForm(){
    const username = document.getElementById('inputUsername').value.trim();
    const password = document.getElementById('inputPassword').value.trim();
    const email = document.getElementById('inputEmail').value.trim();

    const usernameError = document.getElementById('usernameMsg');
    const passwordError = document.getElementById('passwordMsg');
    const emailError = document.getElementById('emailMsg');

    if(username.length <= 0){
        usernameError.style.visibility = 'visible';
        usernameError.textContent = "Please enter a username";
        setTimeout(() => {usernameError.style.visibility = 'hidden'},2500);
        return false;
    }    
    if(username.length > 20){
        usernameError.style.visibility = 'visible';
        usernameError.textContent = "Username can be a maximum of 20 characters";
        setTimeout(() => {usernameError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(username.includes('<') || username.includes('>') || username.includes('&') ||
        username.includes('"') || username.includes("'")){
        usernameError.style.visibility = 'visible';
        usernameError.textContent = "This username contains invalid characters. Please try another one";
        setTimeout(() => {usernameError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(password.length <= 0) {
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Please enter a password";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(password.length < 12) {
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Password length must be at least 12 characters long";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false; 
    }
    if(!(/[a-z]/.test(password))){
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Password must contain a lower case character";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(!(/[A-Z]/.test(password))){
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Password must contain an upper case character";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(!(/\d/.test(password))){
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Password must contain a number";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(!(/[#.?!@$%^&*-]/.test(password))){
        passwordError.style.visibility = 'visible';
        passwordError.textContent = "Password must contain a special character: #.?!@$%^&*-";
        setTimeout(() => {passwordError.style.visibility = 'hidden'},2500);
        return false;
    }  
    if(!(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email))){
        emailError.style.visibility = 'visible';
        emailError.textContent = "Please enter a valid email address";
        setTimeout(() => {emailError.style.visibility = 'hidden'},2500);
        return false;
    }
    return true;
}