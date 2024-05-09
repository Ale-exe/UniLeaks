const generateDigits = (numDigits) => {
    const dict = "0123456789";
    var digits = "";
    for(var i = 0; i < numDigits; i++){
        digits += dict[Math.floor(Math.random() * (dict.length))];
    }
    return digits;
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
    return text.replaceAll('&amp','&')
        .replaceAll('&lt','<')
        .replaceAll('&gt','>')
        .replaceAll('&quot','"')
        .replaceAll('&#x27',"'");
}

module.exports = {
    generateDigits,
    encodeOutput,
    decodeOutput
}