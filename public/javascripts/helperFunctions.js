// This function allows cookie values to be accessed by specifying the name of their key
function getCookieByKey(key){
    // Splits the cookie string using the standard cookie separator ";"
    const split = document.cookie.split(";");
    // Cookies are now split into key and value e.g. key = 'value'

    // For each splitCookie, further split on the '=' and set each side to a key / value pair in a map
    const cookieMapper = new Map();
    for (let i = 0; i < split.length; i++){
        cookieMapper.set(split[i].trim().split('=')[0],
            split[i].trim().split('=')[1]);
    }
    return cookieMapper.get(key);
}

// Allows the time in minutes to be passed to this function - cookie will be removed after this amount of time
function setCookieExpiry(minutes){
    let time = new Date();
    time.setTime(time.getTime() + (minutes * 60 * 1000));
    return time.toUTCString();
}

// Displays error message before hiding it again
function postErrorMessage(text){
    const err = document.getElementById('formErr');
    err.style.visibility = 'visible';
    err.textContent = text;
    setTimeout(() => {err.style.visibility = 'hidden'},2500);
}

// Generates a random key using random characters from array

async function retrieveKey(type){
    let typeObj = {type:type};
    let json = JSON.stringify(typeObj);

    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })

    return fetch('/getkeyfromJSON', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken,
        }
    })
        .then((response) => {
            return response.json().then((data) => {
                return data.key;
            })
        });
}

function decrypt(string, key){
    let decrypt = CryptoJS.AES.decrypt(string, key);
    let decryptVar = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptVar;

}

function encodeOutput(text){
    const specialChars = {'&': '&amp', '<': '&lt', '>': '&gt', '"': '&quot', "'": '&#x27'};

        console.log(text);
    return text.replace(/[&<>"']/g, function(char){
        let encodedChar = specialChars[char] || char;
        return encodedChar;
    });
}

function decodeOutput(text){
    const specialChars = {'&amp': '&', '&lt': '<', '&gt': '>', '&quot': '"', '&#x27': "'"};

        console.log(text);
    return text.replace(/[&<>"']/g, function(char){
        let encodedChar = specialChars[char] || char;
        return encodedChar;
    });
}

// gets the username of the user logged in
async function getSession() {
    let csrfToken = '';
    await fetch('/csrf-token').then(res => res.json()).then(data => {
        csrfToken = data.token;
    })
    const hashResponse = await fetch("/getsession", {
        'x-csrf-token': csrfToken
    })
    const json = await hashResponse.json()

    if (json.status === 201) {
        return json.result.bloggerusername;
    }
}

function onCredentialsCorrect(){
    let canvas = document.getElementById('offcanvasAuth');
    let initCanvas = new bootstrap.Offcanvas(canvas);
    initCanvas.show(initCanvas);
}

function onPopupClose(){
    let errorMsg = document.getElementById('verificationError');
    errorMsg.style.visibility = "hidden";
    
}