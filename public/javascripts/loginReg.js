// Compares form data with database entries. If there is a match, gives user a session token, logging them in
// TODO: We probably want to limit the number of successful attempts due how the user
//  can test to see if an email address exists in the registration form
async function login(){
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);


    await fetch('/users/checkcredentials', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((response) => {
            if (response.status === 201){
                console.log("success");
                // give session cookie - cookie expires after 60 minutes
                // document.cookie = `bloggerLoggedIn = ${data.username}; expires = ${setCookieExpiry(60)}`;
                document.cookie = `bloggerLoggedIn = ${CryptoJS.AES.encrypt(data.username, 'key')}; expires = ${setCookieExpiry(60)}`;

                // const cipherText = CryptoJS.AES.encrypt(`${getCookieByKey('bloggerLoggedIn')}`,"secret key 123").toString();
                // console.log(cipherText);

                // let bytes  = CryptoJS.AES.decrypt(cipherText, 'secret key 123');
                // let originalText = bytes.toString(CryptoJS.enc.Utf8);
                // console.log(originalText);

                // relocate to main page
                window.location.href = '/'
            }  else{
                // show error message
                const errorAlert = document.getElementById('loginAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.innerText = response.message;

                // add 1 to count of incorrect attempts - lock out for 30 mins?
            }
        })
}

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

async function register(){
    if(!validateRegisterForm())
        return; 
    const form = document.getElementById('regForm');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    await fetch('/users/createaccount', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json())
        .then((response) => {
            if (response.status === 201){
                console.log("success");
                window.location.href = '/login'
            }  else{
                const errorAlert = document.getElementById('regAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.innerText = response.message;
            }
        })
}