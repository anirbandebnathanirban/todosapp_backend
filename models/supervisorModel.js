const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contactNoRegex = /^[1-9]\d{1,14}$/;

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
    supervisorPrimaryEmail: {
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
    supervisorSecondaryEmails: [{
        type: String,
        validate: {
            validator: function(value) {
                return emailRegex.test(value);
            },
            message: "Please Enter a valid Email Address !!",
        },
    }], 
    supervisorContactNumber: [{
        type: String,
        validate: {
            validator: function(value) {
                return contactNoRegex.test(value);
            },
            message: 'Please Enter a valid contact number !!',
        },
    }]
});

supervisorSchema.path('supervisorSecondaryEmails').validate({
    validator: function(emails) {
        if(!emails)return true;
        return emails.length == new Set(emails).size;
    },
    message: 'Email Addresses of supervisor should be unique !!',
});

module.exports = mongoose.model('supervisor', supervisorSchema);