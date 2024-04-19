// Compares form data with database entries. If there is a match, gives user a session token, logging them in
// TODO: We probably want to limit the number of successful attempts due how the user
//  can test to see if an email address exists in the registration form

async function generateCaptcha(){
    console.log("generate captcha onload")
    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    await fetch('/generate-captcha').then(res => res.json()).then(captcha => {
        const img = document.getElementById('captchaImg');
        img.setAttribute('src', captcha.uri)
        
    });

}

async function login(){
    // Gets user entered form data
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    let csrfToken = '';
    
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
    
    await fetch('/users/checkcredentials', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        }
    })
        .then(res => res.json())
        .then((response) => {
            console.log(response)
            if (response.status === 201){

                window.location.href = '/'
            }  else{
                // If unsuccessful show error message
                const errorAlert = document.getElementById('loginAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.textContent = encodeOutput(response.message);

                // add 1 to count of incorrect attempts - lock out for 30 mins?
            }
        })
    
}

async function keyToJSON(type, hash){
    let hashStorage = {type:type, hash:hash};
    let json = JSON.stringify(hashStorage);
    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
  

    await fetch('/editJSON', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        }
    })
        .then(res => res.json())
        .then((response) => {
            if (response.status === 201){
                console.log(response.message);
            } else {
                console.log(response.message);
                return hash;
            }
        })
}

async function register(){
    if(!validateRegisterForm())
        return;

    const form = document.getElementById('regForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Store in database. Password is encrypted database side with the random key

    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    await fetch('/users/createaccount', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
             'x-csrf-token': csrfToken
        }
    })
        .then(res => res.json())
        .then((response) => {
            if (response.status === 201){
                console.log("success");
                window.location.href = '/login'
            }  else{
                // If data could not be stored successfully in database, display generic error message
                const errorAlert = document.getElementById('regAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.textContent = encodeOutput(response.message);

                document.getElementById('captchaInput').value = '';
                generateCaptcha();

            }
        })
        
}

async function logOut(){
    console.log(await getSession());
    // the name of the session owner
    let sessionObj = {username:await getSession()};

    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
    await fetch('/deletesession', {
        method: 'POST',
        body: JSON.stringify(sessionObj),
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        }
    })
        .then(res => res.json())
        .then((response) => {
            if (response.status === 201){
                window.location.reload();

            }  else{
                console.log("logout failed")
            }
        })
}