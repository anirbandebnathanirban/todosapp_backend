const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactNoRegex = /\d{3}-\d{3}-\d{4}/;

const supervisorSchema = new Schema({
    supervisorName: {
        supervisorFirstName: {
            type: String,
            required: [true, 'First Name of supervisor is required !!'],
        },
        supervisorMiddleName: { type: String },
        supervisorLastName: {
            type: String,
            required: [true, 'Last Name of supervisor is required !!'],
        }
    },
    userPrimaryEmail: {
        type: String,
        required: [true, 'Primary Email address of supervisor is required !!'],
        unique: [true, 'Primary Email address of supervisor should be unique !!'],
        validate: {
            validator: function(value) {
                return emailRegex.test(value);
            },
            message: "Please Enter a valid Email Address !!",
        },
    },
    userSecondaryEmails: [{
        type: String,
        validate: {
            validator: function(value) {
                return emailRegex.test(value);
            },
            message: "Please Enter a valid Email Address !!",
        },
    }],
    userContactNumber: [{
        type: String,
        validate: {
            validator: function(value) {
                return contactNoRegex.test(value);
            },
            message: 'Please Enter a valid contact number !!',
        },
    }]
});

supervisorSchema.path('userSecondaryEmails').validate({
    validator: function(emails) {
        return emails.length == new Set(emails).size;
    },
    message: 'Email Addresses of user should be unique !!',
});

module.exports = mongoose.model('supervisor', supervisorSchema);