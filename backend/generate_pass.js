const crypto = require('crypto');

function generatePassword(longitud = 10) {
    return crypto.randomBytes(longitud)
        .toString('base64')
        .slice(0, longitud)
        .replace(/[+/=]/g, '');
}

module.exports = { generatePassword };