/*
    Title: Uptime Monitoring API
    Author: Monayem Hossain Limon
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// App Object - Module Scaffold
const app = {};

// Configuration
app.config = {
    port: 3000,
};

// Creating Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    // Server Listen
    server.listen(app.config.port, () => {
        console.log(`Server listening at ${app.config.port} port`);
    });
};

// Handling Request Response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();



// Inspired: Learn With Sumit