/*
    Title: Write data to file
    Author: Monayem Hossain Limon
*/

// dependencies
const data = require('../lib/data');

// Module Scaffolding
const sendData = {};

// Write a data
data.create('writeData', 'newFile', {name: 'Monayem', hobby: 'Travelling'}, (err) => {
    console.log(err);
});

// Export Module Scaffolding
module.exports = sendData;