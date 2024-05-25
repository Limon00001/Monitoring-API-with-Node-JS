/*
    Title: Uptime Monitoring API
    Author: Monayem Hossain Limon
*/

// Dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
// const environment = require('./helpers/environments');
// const sendDataata = require('./checkData/sendData');
// const readDataata = require('./checkData/readData');
// const updateData = require('./checkData/updateData');
// const deleteData = require('./checkData/deleteData');

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

        // Environment Variables -> We can pass multiple environment variables to the terminal
        // console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
        // console.log(`PORT: ${process.env.PORT}`);

        console.log(`Server listening at ${app.config.port} port`);
    });
};

// Handling Request Response
app.handleReqRes = handleReqRes;

// Start the server
app.createServer();



// Inspired: Learn With Sumit