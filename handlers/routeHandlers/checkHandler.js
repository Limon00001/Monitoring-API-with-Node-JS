/*
    Title: Uptime Monitoring API (Check Handlers)
    Author: Monayem Hossain Limon
*/
// dependencies
const data = require("../../lib/data");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");
const { maxChecks } = require("../../helpers/environments");

// App Object - Module Scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  // we want to accept 'get', 'post', 'put', 'delete' methods
  const acceptedMethods = ["get", "post", "put", "delete"];
  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405, {
      message: "Method not allowed",
    });
  }
};

handler._check = {};

// For POST method -> create user
handler._check.post = (requestProperties, callback) => {
  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    const token =
      typeof requestProperties.headersObject.token === "string"
        ? requestProperties.headersObject.token
        : false;

    // lookup the user phone by reading the token
    data.read("tokens", token, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const userPhone = tokenData.phone;
        // lookup the user data
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
              if (tokenIsValid) {
                const userObject = userData;
                const userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  const checkId = createRandomString(20);
                  const checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };
                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "There was a problem in the server side!",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side!",
                      });
                    }
                  });
                } else {
                  callback(401, {
                    error: "Userhas already reached max check limit!",
                  });
                }
              } else {
                callback(403, {
                  error: "Authentication problem!",
                });
              }
            });
          } else {
            callback(403, {
              error: "User not found!",
            });
          }
        });
      } else {
        callback(403, {
          error: "Authentication problem!",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// For GET method
handler._check.get = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    data.read("checks", id, (err, checkData) => {
      //   const user = { ...parseJSON(u) };
      if (!err && checkData) {
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              callback(200, checkData);
            } else {
              callback(403, {
                error: "Authentication problem!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "Check not found! Server side error",
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
handler._check.put = (requestProperties, callback) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

  // validate inputs
  const protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  const url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  const method =
    typeof requestProperties.body.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(requestProperties.body.method) > -1
      ? requestProperties.body.method
      : false;

  const successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  const timeoutSeconds =
    typeof requestProperties.body.timeoutSeconds === "number" &&
    requestProperties.body.timeoutSeconds % 1 === 0 &&
    requestProperties.body.timeoutSeconds >= 1 &&
    requestProperties.body.timeoutSeconds <= 5
      ? requestProperties.body.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || successCodes || timeoutSeconds) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = checkData;
          const token =
            typeof requestProperties.headersObject.token === "string"
              ? requestProperties.headersObject.token
              : false;

          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (tokenIsValid) => {
              if (tokenIsValid) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkObject.timeoutSeconds = timeoutSeconds;
                }

                // Store the object
                data.update("checks", id, checkObject, (err) => {
                  if (!err) {
                    callback(200, checkObject);
                  } else {
                    callback(500, {
                      error: "There was a problem in the server side!",
                    });
                  }
                });
              } else {
                callback(403, {
                  error: "Authentication problem!",
                });
              }
            }
          );
        } else {
          callback(500, {
            error: "Check not found! Server side error",
          });
        }
      });
    } else {
      callback(400, {
        message: "Must provide one or more field to update.",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

// For DELETE method
handler._check.delete = (requestProperties, callback) => {
  // check the token id if valid
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    // lookup the user
    data.read("checks", id, (err, checkData) => {
      //   const user = { ...parseJSON(u) };
      if (!err && checkData) {
        const token =
          typeof requestProperties.headersObject.token === "string"
            ? requestProperties.headersObject.token
            : false;

        tokenHandler._token.verify(
          token,
          checkData.userPhone,
          (tokenIsValid) => {
            if (tokenIsValid) {
              data.delete('checks', id, (err) => {
                if (!err) {
                  data.read('users', checkData.userPhone, (err, userData) => {
                    let userObject = userData;
                    if (!err && userData) {
                      let userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                      // remove the deleted check id
                      let checkPosition = userChecks.indexOf(id);
                      if(checkPosition > -1) {
                        userChecks.splice(checkPosition, 1);
                        userObject.checks = userChecks;
                        data.update('users', userObject.phone, userObject, (err) => {
                          if(!err) {
                            callback(200);
                          } else {
                            callback(500, {
                              message: 'There was an error updating the user'
                            })
                          }
                        })
                      }
                    } else {
                      callback(500, {
                        message: 'There was an error deleting'
                      })
                    }
                  })
                } else {
                  callback(500, {
                    message: 'There is a server side error'
                  })
                }
              });
            } else {
              callback(403, {
                error: "Authentication problem!",
              });
            }
          }
        );
      } else {
        callback(500, {
          error: "Check not found! Server side error",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found!",
    });
  }
};

// module.exports
module.exports = handler;
