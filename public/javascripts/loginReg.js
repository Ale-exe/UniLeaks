// Compares form data with database entries. If there is a match, gives user a session token, logging them in
// TODO: We probably want to limit the number of successful attempts due how the user
//  can test to see if an email address exists in the registration form
async function login(){
    // Gets user entered form data
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    /*

    // Accesses JSON file and retrieves the key associated with the passed in username
    await fetch('/users/readJSONPasswordKeys', {
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(res => res.json()).then((response) => {
        if(response.status === 201){
            // IF user exists in JSON file, assigns the key to the empty variable
            key = response.key;

            // appends key to other user user inputs in login form
            const appendedData = Object.assign({},data,{
                key: key
            })

            // Compares user entered password with database password decrypted with key
            // Generates cookie with a 60 minute expiry time
            generateCookie(appendedData);
       } else {
            // Otherwise shows generic error message
            const errorAlert = document.getElementById('loginAlert');
            errorAlert.style.visibility = 'visible';
            errorAlert.innerText = response.message;
        }
    })
    */

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
                errorAlert.innerText = response.message;

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
                errorAlert.innerText = response.message;

                // add 1 to count of incorrect attempts - lock out for 30 mins?
            }
        })
}

// Places username and key as a key:value pair within a JSON file
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







// If user inputs satisfy validations, take inputs, generate a random key, then store in database.
// Password is encrypted database side with the random key. Key is then placed in a JSON file.
async function register(){
    if(!validateRegisterForm())
        return;

    const form = document.getElementById('regForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Generates random 256bit key to satisfy OWASP security guidelines
 //   const rand = randomKey(32);

    // Append key to gathered user form data
  /*
    const appendedData = Object.assign({},data,{
        key: rand
    })
*/

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

                // Store username and key as a key:value pair within a JSON file
                //keyToJSONPasswords(appendedData.username, rand);

                window.location.href = '/login'
            }  else{
                // If data could not be stored successfully in database, display generic error message
                const errorAlert = document.getElementById('regAlert');
                errorAlert.style.visibility = 'visible';
                errorAlert.innerText = response.message;
            }
        })
}

// Places username and key as a key:value pair within a JSON file
async function keyToJSONPasswords(username, key){
    //let keyStorage = {user:username, key:key};
    //let json = JSON.stringify(keyStorage);

    await fetch('/editJSONPasswords', {
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
            }
        }).catch((err) => {
            console.log(err);
        })
}