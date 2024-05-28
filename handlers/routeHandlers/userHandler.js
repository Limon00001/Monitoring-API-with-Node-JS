/*
    Title: Uptime Monitoring API (User Handlers)
    Author: Monayem Hossain Limon
*/
// dependencies
const data = require("../../lib/data");
const { hash, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

// App Object - Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  // we want to accept 'get', 'post', 'put', 'delete' methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Method not allowed",
    });
  }
};

handler._users = {};

// For POST method -> create user
handler._users.post = (requestProperties, callback) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean" &&
    requestProperties.body.tosAgreement
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    data.read("users", phone, (err, user) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        // Store the users data
        data.create("users", phone, userObject, (err) => {
          if (!err) {
            callback(200, {
              message: "User created successfully",
            });
          } else {
            console.log(err);
            callback(500, {
              message: "Couldn't connect to the server.",
            });
          }
        });
      } else {
        callback(400, {
          message: "There was an error in server side.",
        });
      }
    });
  } else {
    callback(400, {
      message: "Missing required fields",
    });
  }
};

// For GET method
handler._users.get = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the user
        data.read("users", phone, (err, user) => {
          //   const user = { ...parseJSON(u) };
          if (!err && user) {
            delete user.password;

            callback(200, user);
          } else {
            callback(404, {
              error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          message: "Authentication failed!",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found!",
    });
  }
};

// For PUT method
handler._users.put = (requestProperties, callback) => {
  // check the phone number if valid
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;

  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;

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

  if (phone) {
    if (firstName || lastName || password) {
      // verify token
      let token =
        typeof requestProperties.headersObject.token === "string"
          ? requestProperties.headersObject.token
          : false;

      tokenHandler._token.verify(token, phone, (tokenId) => {
        if (tokenId) {
          // lookup the users
          data.read("users", phone, (err, userData) => {
            if (!err && userData) {
              // update the fields
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              // store the user
              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callback(200, {
                    message: "User updated successfully",
                  });
                } else {
                  callback(500, {
                    message: "Couldn't connect to the server.",
                  });
                }
              });
            }
          });
        } else {
          callback(403, {
            message: "Authentication failed!",
          });
        }
      });
    } else {
      callback(400, {
        message: "You have problems in your field. Please try again.",
      });
    }
  } else {
    callback(400, {
      message: "Invalid phone number",
    });
  }
};

// For DELETE method
handler._users.delete = (requestProperties, callback) => {
  // check the phone number if valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // verify token
    let token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        // lookup the users
        data.read("users", phone, (err, userdata) => {
          if (!err && userdata) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callback(200, {
                  message: "User deleted successfully",
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
        callback(403, {
          message: "Authentication failed!",
        });
      }
    });
  } else {
    callback(400, {
      message: "Invalid phone number",
    });
  }
};

// module.exports
module.exports = handler;
