/*
    Title: Update data to file
    Author: Monayem Hossain Limon
*/

// dependencies
const data = require('../lib/data');

// Module Scaffolding
const deleteData = {};

// Write a data
data.delete('writeData', 'newFile', (err) => {
    console.log(err);
});

// Export Module Scaffolding
module.exports = deleteData;