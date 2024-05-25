/*
    Title: Environments
    Author: Monayem Hossain Limon
*/

// Dependencies

// App Object - Module Scaffolding
const environments = {};

// For Staging
environments.staging = {
    port: 3000,
    envName:'staging',
};

// For Production
environments.production = {
    port: 5000,
    envName:'production',
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Module Export
module.exports = environmentToExport;