const generateDigits = (numDigits) => {
    const dict = "0123456789";
    let digits = "";
    for(let i = 0; i < numDigits; i++){
        digits += dict[Math.floor(Math.random() * (dict.length))];
    }
    return digits;
}

function encodeOutput(text){
    const specialChars = {'&': '&amp', '<': '&lt', '>': '&gt', '"': '&quot', "'": '&#x27'};
    return text.replace(/[&<>"']/g, function(char){
        let encodedChar = specialChars[char] || char;
        return encodedChar;
    });
}

function decodeOutput(text){
    return text.replaceAll('&amp','&')
        .replaceAll('&lt','<')
        .replaceAll('&gt','>')
        .replaceAll('&quot','"')
        .replaceAll('&#x27',"'");
}

function validatePost(postTitle, postBody){
    if(postTitle.includes('<') || postTitle.includes('>'))
        return false;
    return true;
}

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

function validateRegisterForm(username, password, email){

    if(username.length <= 0){
        usernameError.style.visibility = 'visible';
        usernameError.textContent = "Please enter a username";
        setTimeout(() => {usernameError.style.visibility = 'hidden'},2500);
        return false;
    }
    if(username.length > 20){
        return false;
    }
    if(username.includes('<') || username.includes('>') || username.includes('&') ||
        username.includes('"') || username.includes("'")){
        return false;
    }
    if(password.length <= 0) {
        return false;
    }
    if(password.length < 12) {
        return false;
    }
    if(!(/[a-z]/.test(password))){
        return false;
    }
    if(!(/[A-Z]/.test(password))){
        return false;
    }
    if(!(/\d/.test(password))){
        return false;
    }
    if(!(/[#.?!@$%^&*-]/.test(password))){
        return false;
    }
    if(!(/[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email))){
        return false;
    }
    return true;
}

function checkFile(file) {

    console.log(file);

     if (file !== "" && (file.toLowerCase().includes("jpg") || file.toLowerCase().includes("png")
         || file.toLowerCase().includes("gif"))) {
         return true;
     } else {
         return false;
     }

}

const getPostById = (postid) => {

    let queryString = "SELECT * FROM dss.blogposts WHERE postid = $1"

    if (queryString.includes(postid)){
        return false
    } else {
        return true;
    }
}

function editValidateWordcount(postTitle, postBody){
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

module.exports = {
    generateDigits,
    encodeOutput,
    decodeOutput,
    validatePost,
    validateWordcount,
    validateRegisterForm,
    checkFile,
    getPostById,
    editValidateWordcount
}