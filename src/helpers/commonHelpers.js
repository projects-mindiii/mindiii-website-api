import { random } from "lodash";


/*
 *@get random number between 1000 to 9999
 *@return 4 digit Number
 */
const getOtp = function() {

    /*
     *@set minimum and maximum range 
     */
    const range = { min: 1000, max: 9999 },
        delta = range.max - range.min;
    /*
     *@get random number using math function
     */
    var randomNumber = Math.round(range.min + Math.random() * delta);

    return randomNumber;
}

/**
 * Function to produce UUID.
 */
const generateUUID = function() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now();
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    // console.log(uuid);
    return uuid;
}

// get random string according to requird length
const getRandomString = function(strLength, charSet) {
    var result = [];
    
    strLength = strLength || 5;
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    while (strLength--) { // (note, fixed typo)
        result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }
    
    return result.join('');
}

const commonHelpers = {
    getOtp,
    generateUUID,
    getRandomString

}

export default commonHelpers