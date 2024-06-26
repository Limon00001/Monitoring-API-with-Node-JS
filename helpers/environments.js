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
    secretKey:'svkjkjdsnjsdvnksj',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC123',
        authToken: '123',
        fromPhone: '+123'
    }
};

// For Production
environments.production = {
    port: 5000,
    envName:'production',
    secretKey:'sdjbfoaisfjsdoivns',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC123',
        authToken: '123',
        fromPhone: '+123'
    }
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.staging;

// Module Export
module.exports = environmentToExport;