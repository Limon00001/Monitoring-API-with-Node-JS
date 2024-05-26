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

// module.exports
module.exports = utilities;
