/*
    Title: Uptime Monitoring API (Request & Rseponse)
    Author: Monayem Hossain Limon
*/

// Dependencies
const url = require('url');
const {StringDecoder} = require('string_decoder');
const routes = require('../routes');
const {notFoundHandler} = require('../handlers/routeHandlers/notFoundHandler');

// App Object - Module Scaffolding
const handler = {};

// Handle Request and Response
handler.handleReqRes = (req, res) => {
    // Request handle
    // Get the URL and parse it
    const parsedUrl = url.parse(req.url, true);

    // Set the pathname same format/url format
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // All methods into Lower Case
    const method = req.method.toLowerCase();

    // Get the Query string object
    const queryStringObject = parsedUrl.query;

    // Get the Headers if all metadata need to be catched
    const headersObject = req.headers;

    // Request Properties
    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject
    };

    // Handle requested data decoding
    const decoder = new StringDecoder('utf8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();

        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
            payload = typeof(payload) === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);
    
            // Return the Final Response
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        // Response handle
        res.end('Hello!');
    });

};

// exports: module
module.exports = handler;