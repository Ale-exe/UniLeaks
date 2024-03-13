// Determines if a user has an active session and provides different page content based on this
function loadSession(){
    // if a session cookie called 'bloggerLoggedIn' exists
    if(getCookieByKey('bloggerLoggedIn') !== undefined){

        // create paragraph to welcome user
        const loggedInText = document.createElement('p');
        loggedInText.innerText = `Logged in as ${getCookieByKey('bloggerLoggedIn')}...`;
        loggedInText.style.fontWeight = 'bold';
        loggedInText.setAttribute('class','ms-auto')
        document.getElementById('loginDiv').appendChild(loggedInText);

        // create logout button that deletes cookie on click
        const logout = document.createElement('p');
        logout.innerText = 'Logout';
        logout.style.color = 'blue';
        // On click, deletes cookie, logging user out
        logout.addEventListener('click', () => {
            document.cookie = `bloggerLoggedIn =; expires = Thu, 01 Jan 1970 00:00:00 UTC;`;
            window.location.reload();
        })
        document.getElementById('loginDiv').appendChild(logout);


        // if it doesn't exist, do not render a post button and instead prompt them to log in
    } else {
        // Dynamically create paragraph to prompt user to log in - Links to login form
        const hyper = document.createElement('a');
        hyper.href = "/login";
        hyper.textContent = "here";

        const loginText = document.createElement('p');
        loginText.innerText = "Not currently logged in. To post, log in ";
        loginText.appendChild(hyper);
        document.getElementById('mainContent').appendChild(loginText);

        // Hide post form
        document.getElementById('postCreationForm').style.display = 'none';
    }
}

