const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-@#$.%&*])(?=.*[a-zA-Z]).{8,16}$/;
const contactNoRegex = /^[1-9]\d{1,14}$/;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required !!'],
        unique: [true, 'username should be unique !!'],
    },
    userName: {
        userFirstName: {
            type: String,
            required: [true, 'First Name of user id required !!'],
        },
        userMiddleName: { type: String },
        userLastName: {
            type: String,
            required: [true, 'Last Name is required !!'],
        },
    },
    userPrimaryEmail: {
        type: String,
        required: [true, 'Primary Email address of user is required !!'],
        unique: [true, 'Primary Email address of user should be unique !!'],
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
    userPassword: {
        type: String,
        required: [true, 'password of user is required !!'],
        validate: {
            validator: function(value) {
                return passwordRegex.test(value);
            },
            message: "At least 8 - 16 characters, must contain at least 1 uppercase letter, must contain at least 1 lowercase letter, and 1 number, Can contain any of this special characters @ $ % # * & - .",
        }
    },
    userContactNumber: [{
        type: String,
        validate: {
            validator: function(value) {
                return contactNoRegex.test(value);
            },
            message: 'Please Enter a valid contact number !!',
        },
    }],
    // userProfilePicture: { type: 'Buffer' },
    userTasks: [{
        type: Schema.Types.ObjectId,
        ref: 'task',
    }],
    userTeams: [{
        type: Schema.Types.ObjectId,
        ref: 'team',
    }],
}, {timestamps: true});

userSchema.path('userSecondaryEmails').validate({
    validator: function(emails) {
        if(!emails)return true;
        return emails.length == new Set(emails).size;
    },
    message: 'Email Addresses of user should be unique !!',
});

userSchema.pre('save', function(next) {
    if(!this.isModified('userPassword'))return next();
    bcrypt.genSalt(10, (err, salt) => {
        if(err)throw err;
        bcrypt.hash(this.userPassword, salt, (err, hash) => {
            if(err)throw err;
            this.userPassword = hash;
            next();
        });
    });
});

module.exports = mongoose.model("user", userSchema);