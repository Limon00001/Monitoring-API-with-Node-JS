/*
    Title: Read Data
    Author: Monayem Hossain Limon
*/

// dependencies
const data = require('../lib/data');

// Module Scaffolding
const readData = {};

// Write a data
data.read('writeData', 'newFile', (err, data) => {
    console.log(err, data);
});

// Export Module Scaffolding
module.exports = readData;