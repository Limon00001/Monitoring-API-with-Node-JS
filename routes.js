/*
    Title: Uptime Monitoring API (Routes)
    Author: Monayem Hossain Limon
*/

// Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

// App Object - Module Scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

// Exports module
module.exports = routes;
