/*
    Title: Uptime Monitoring API (Token Handlers)
    Author: Monayem Hossain Limon
*/
// dependencies
const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");

// App Object - Module Scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  // we want to accept 'get', 'post', 'put', 'delete' methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Method not allowed",
    });
  }
};

handler._token = {};

// For POST method -> create user
handler._token.post = (requestProperties, callback) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      let hassedpassword = hash(password);
      if (hassedpassword === userData.password) {
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // stoe the token into the database
        data.create("tokens", tokenId, tokenObject, (err) => {
          if (!err) {
            callback(200, tokenObject);
          } else {
            callback(500, {
              error: "Could not create the new token",
            });
          }
        });
      } else {
        callback(400, {
          error: "Password does not match. Please try again.",
        });
      }
    });
  } else {
    callback(400, {
      error: "Missing required fields",
    });
  }
};

// For GET method
handler._token.get = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    data.read("tokens", id, (err, token) => {
      //   const user = { ...parseJSON(u) };
      if (!err && token) {
        callback(200, token);
      } else {
        callback(404, {
          error: "Invalid token!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

// For PUT method
handler._token.put = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? true
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, token) => {
      // let tokenObject = token.expires;
      if (token.expires > Date.now()) {
        token.expires = Date.now() + 60 * 60 * 1000;

        // store the updated token
        data.update("tokens", id, token, (err) => {
          if (!err) {
            callback(200, {
              message: "Token has been extended",
            });
          } else {
            callback(500, {
              message: "Server error! Please try again later",
            });
          }
        });
      } else {
        callback(400, {
          error: "Invalid token!",
        });
      }
    });
  } else {
    callback(400, {
      error: "There was an error processing the request",
    });
  }
};

// For DELETE method
handler._token.delete = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the users
    data.read("tokens", id, (err, tokendata) => {
      if (!err && tokendata) {
        data.delete("tokens", id, (err) => {
          if (!err) {
            callback(200, {
              message: "Token deleted successfully",
            });
          } else {
            callback(500, {
              message: "Couldn't connect to the server.",
            });
          }
        });
      } else {
        callback(404, {
          message: "User not found!",
        });
      }
    });
  } else {
    callback(400, {
      message: "Invalid token number",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
        if (tokenData.phone === phone && tokenData.expires > Date.now()) {
            callback(true);
        } else {
            callback(false);
        }
    } else {
        callback(false);
    }
  });
};

// module.exports
module.exports = handler;
