/*
    Title: Uptime Monitoring API (Utilities)
    Author: Monayem Hossain Limon
*/
// dependencies
const crypto = require("crypto");
const environments = require("../helpers/environments");

// App Object - Module Scaffolding
const utilities = {};

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
};

// Hash password
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  } else {
    return false;
  }
};

// Random String
utilities.createRandomString = (strlength) => {
  let length = strlength;
  length = typeof strlength === "number" ? strlength : false;
  if (length) {
    let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
    let output = '';
    for (let i = 1; i <= length; i += 1) {
      const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};

// module.exports
module.exports = utilities;
