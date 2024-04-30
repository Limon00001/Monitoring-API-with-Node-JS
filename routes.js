/*
    Title: Uptime Monitoring API (Routes)
    Author: Monayem Hossain Limon
*/

// Dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');

// App Object - Module Scaffolding
const routes = {
    sample: sampleHandler
};

// Exports module
module.exports = routes;