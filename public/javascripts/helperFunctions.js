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
function randomKey(length){
    let series = '';
    const letterArr = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-=/<>#';

    for (let i = 0; i < length; i++){
        series += letterArr[Math.floor(Math.random() * (letterArr.length))];
    }
    console.log(series);
    return series;
}
async function keyToJSONPasswords(username, key){
    let keyStorage = {user:username, key:key};
    let json = JSON.stringify(keyStorage);

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

async function retrieveKey(type){
    let typeObj = {type:type};
    let json = JSON.stringify(typeObj);

    return fetch('/getkeyfromJSON', {
        method: 'POST',
        body: json,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
            return response.json().then((data) => {
                return data.key;
            })
        });
}

