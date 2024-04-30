/*
    Title: Uptime Monitoring API (Handlers)
    Author: Monayem Hossain Limon
*/

// App Object - Module Scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Not Found',
    })
};

// module.exports
module.exports = handler;