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
                const rand = randomKey(32);
                // give session cookie encrypted using AES - strongest hashing algorithm
                // - cookie set to expire after 60 minutes
                document.cookie = `bloggerLoggedIn = ${CryptoJS.AES.encrypt(data.username, rand)}; expires = ${setCookieExpiry(60)}`;
                keyToJSON('session',rand);
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