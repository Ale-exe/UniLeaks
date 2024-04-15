async function loadSession() {

     let csrfToken = '';
       await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
    await fetch('/getsession', {
        'x-csrf-token': csrfToken,
    })
        .then(res => res.json())
        .then((sessionData) => {
            console.log(sessionData);

            if (sessionData.status === 201) {
                // create paragraph to welcome user
                const loggedInText = document.createElement('p');
                // gets username from sessionData
                loggedInText.textContent = `Logged in as ${sessionData.result.bloggerusername}...`;

                loggedInText.style.fontWeight = 'bold';
                loggedInText.setAttribute('class', 'ms-auto')
                document.getElementById('loginDiv').appendChild(loggedInText);

                // create logout button that deletes cookie on click
                const logout = document.createElement('p');
                logout.textContent = 'Logout';
                logout.style.color = 'blue';
                // On click, deletes cookie, logging user out
                logout.addEventListener('click', () => {
                    logOut();
                })
                document.getElementById('loginDiv').appendChild(logout);
                return true;
            } else {
                // Dynamically create paragraph to prompt user to log in - Links to login form
                const hyper = document.createElement('a');
                hyper.href = "/login";
                hyper.textContent = "here";

                const loginText = document.createElement('p');
                loginText.textContent = "Not currently logged in. To post, log in ";
                loginText.appendChild(hyper);
                document.getElementById('mainContent').appendChild(loginText);

                // Hide post form
                document.getElementById('postCreationForm').style.display = 'none';
                return false;
            }
        })
}