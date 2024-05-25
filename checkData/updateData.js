/*
    Title: Update data to file
    Author: Monayem Hossain Limon
*/

// dependencies
const data = require('../lib/data');

// Module Scaffolding
const updateData = {};

// Write a data
data.update('writeData', 'newFile', {name: 'Girl', hobby: 'Bitching'}, (err, data) => {
    console.log(err, data);
});

// Export Module Scaffolding
module.exports = updateData;