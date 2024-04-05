const argon2 = require("argon2")

async function hash(password) {
    let hashedPwd;
    
    try{
        hashedPwd = await argon2.hash(password);
        return hashedPwd;
    } catch (err) {
        console.log("ERROR: " + err);
    }
    return hashedPwd;

}

async function verify(hash, password){
    try{
        if(await argon2.verify(hash,password)){
            return true;
        } else{
            console.log("no match")
            return false;
        }
    } catch (err){
        return false;
    }
} 

module.exports = {hash, verify};