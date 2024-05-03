// Compares form data with database entries. If there is a match, gives user a session token, logging them in
// TODO: We probably want to limit the number of successful attempts due how the user
//  can test to see if an email address exists in the registration form

async function generateCaptcha(){
    console.log("generate captcha onload")
    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })


    var canvas = document.getElementById('captchaCanvas');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    await fetch('/generate-captcha').then(res => res.json()).then(captcha => {

        /*const img = document.getElementById('captchaImg');
        img.setAttribute('src', captcha.uri);
        var rotate = Math.random() * 20 - 10;
        var scaleX = Math.random() * 0.01 + 1.2;
        var scaleY = Math.random() * 0.01 + 1.2;

        img.style.transform = `rotate(${rotate}deg) scaleX(${scaleX}) scaleY(${scaleY})`;
 */

        
        context.font = 'italic 40pt Calibri';
        context.fillStyle="white";
        context.fillRect(0,0,canvas.width, canvas.height)
        context.fillStyle = "black";
        context.fontStyle = "bold";
       
        //random lines to distort the captcha
        for (let i = 0; i < 15; i++) {
            const x1 = Math.random() * canvas.width;
            const y1 = Math.random() * canvas.height;
            const x2 = Math.random() * canvas.width;
            const y2 = Math.random() * canvas.height;

            context.lineWidth = 2
            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.strokeStyle = 'rgba(0, 0, 0, 0.6)';
            context.stroke();
    }


        let chars = captcha.captchaKey;
        console.log(chars);

        for(let i=0; i < chars.length; i++){
            const x_offset = Math.random() * 10 - 5;
            const y_offset = Math.random() * 10 - 5;
            const angle = Math.random() * 0.2 - 0.1;

            context.save();
            context.translate(15 + x_offset + i * 40, 100 + y_offset);
            context.rotate(angle);
           // context.translate(15 + x_offset + 20, y_offset);
            context.fillText(chars[i], 0, 0);
            context.restore();            
      
        }
    });

}

async function sendVerificationEmail(){
    const inputUsername = document.getElementById('inputUsername').value;
    const inputPassword  = document.getElementById('inputPassword').value;
    const captchaInput  = document.getElementById('captchaInput').value;

     let csrfToken = '';
    
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })    

    console.log("Verifying...");

    await fetch('/users/checkaccountexists', {
        method: 'POST',
        body: JSON.stringify({"username": inputUsername, "password": inputPassword, "captchaInput": captchaInput}),
        headers:{
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
        }
    }).then(res => res.json())
    .then((json) => {
        if(json.status !== 201){
            const errorAlert = document.getElementById('loginAlert');
            errorAlert.style.visibility = 'visible';
            errorAlert.textContent = encodeOutput(json.message);
        }
        else{
            onCredentialsCorrect();
        }
    })
}

async function login(){
    // Gets user entered form data
    const form = document.getElementById('loginForm');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const code = document.getElementById('verificationCodeInput').value;

    const appendedData = Object.assign({},data,{
        verificationCode: code,
    })

    let csrfToken = '';

    console.log(data);
    
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })    
    await fetch('/users/checkcredentials', {
        method: 'POST',
        body: JSON.stringify(appendedData),
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
                const errorAlert = document.getElementById('verificationError');
                console.log(errorAlert);
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