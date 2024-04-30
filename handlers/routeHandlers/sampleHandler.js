/*
    Title: Uptime Monitoring API (Handlers)
    Author: Monayem Hossain Limon
*/

// App Object - Module Scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is a sample url',
    });
};

// module.exports
module.exports = handler;