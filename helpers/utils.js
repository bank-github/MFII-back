/**
 * Created by sherlock on 8/5/2017 AD.
 */
var cfg = require('../config/config');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var mime = require('mime');
var macaddress = require('macaddress');
const moment = require('moment');
var key = cfg.key;

exports.createTokens = async function () {
    return await crypto.randomBytes(cfg.tokenLength).toString('hex');
}

exports.createToken = function (cb) {
    crypto.randomBytes(cfg.tokenLength, function (err, token) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, token.toString('hex'));
        }
    });
}
exports.checkMacAddress = function (data) {
    macaddress.one(function (err, mac) {
        (err)? data(error, null):data(null, mac);
    });
}

// exports.encrypt = function (data) {
//     var cipher = crypto.createCipher('aes-256-cbc', key);
//     var crypted = cipher.update(data, 'utf-8', 'hex');
//     crypted += cipher.final('hex');
//     return crypted;
// }

// exports.decrypt = function (data) {
//     var decipher = crypto.createDecipher('aes-256-cbc', key);
//     var decrypted = decipher.update(data, 'hex', 'utf-8');
//     decrypted += decipher.final('utf-8');
//     return decrypted;
// }
exports.hash = function (data) {
    bcrypt.hash(data, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }
        return hash;
      });
}

exports.compare = function (data) {
    const password = data.password;
    const hashPassword = data.hashPassword;
    bcrypt.compare(password, hashPassword, (err, result) => {
        if (err) {
          console.error(err);
          return;
        }
        return result;
      });
}


/**
 * Encode a string of text as base64
 *
 * @param data The string of text.
 * @returns The base64 encoded string.
 */
exports.encodeBase64 =  function(data) {
    if (typeof btoa === "function") {
        return btoa(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "utf-8").toString("base64");
    } else {
        throw new Error("Failed to determine the platform specific encoder");
    }
}

/**
 * Decode a string of base64 as text
 *
 * @param data The string of base64 encoded text
 * @returns The decoded text.
 */
exports.decodeBase64 = function(data) {
    if (typeof atob === "function") {
        return atob(data);
    } else if (typeof Buffer === "function") {
        return Buffer.from(data, "base64").toString("utf-8");
    } else {
        throw new Error("Failed to determine the platform specific decoder");
    }
}
