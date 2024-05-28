/*
    Title: Uptime Monitoring API (Routes)
    Author: Monayem Hossain Limon
*/

// Dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");

// App Object - Module Scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

// Exports module
module.exports = routes;
