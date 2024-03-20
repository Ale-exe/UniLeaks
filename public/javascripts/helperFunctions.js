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

function postErrorMessage(text){
    const err = document.getElementById('formErr');
    err.style.visibility = 'visible';
    err.textContent = text;
    setTimeout(() => {err.style.visibility = 'hidden'},2500);
}