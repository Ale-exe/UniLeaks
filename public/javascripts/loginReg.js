// Compares form data with database entries. If there is a match, gives user a session token, logging them in
// TODO: We probably want to limit the number of successful attempts due how the user
//  can test to see if an email address exists in the registration form
async function login(){
    // Gets user entered form data
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

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
          
                // Generates a random key for the session cookie
                const rand = randomKey(32);

                // give session cookie encrypted using AES - strongest hashing algorithm
                // - cookie set to expire after 60 minutes
                document.cookie = `bloggerLoggedIn = ${CryptoJS.AES.encrypt(data.username, rand)}; expires = ${setCookieExpiry(60)}`;
                keyToJSON('session',rand);

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

// Compares user entered password with database password decrypted with key
async function generateCookie(data){
    // Checks if the user entered password matches with the database password decrypted by the key
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
          
                // Generates a random key for the session cookie
                const rand = randomKey(32);

                // give session cookie encrypted using AES - strongest hashing algorithm
                // - cookie set to expire after 60 minutes
                document.cookie = `bloggerLoggedIn = ${CryptoJS.AES.encrypt(data.username, rand)}; expires = ${setCookieExpiry(60)}`;
                keyToJSON('session',rand);

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

    await fetch('/editJSON', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
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
                // If data could not be stored successfully in database, display generic error message
                const errorAlert = document.getElementById('regAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.textContent = encodeOutput(response.message);
            }
        })
}