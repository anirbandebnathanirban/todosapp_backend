const process = require('node:process');

module.exports = {
    dbConnectionString: process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/todo-app',
};