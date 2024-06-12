const process = require('node:process');
const mongoose = require('mongoose');
const { dbConnectionString } = require('../config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(dbConnectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Connection with the Database made successfully");
    } catch (error) {
        console.error("Error connecting to Database", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;