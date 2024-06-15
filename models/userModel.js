const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const contactNoRegex = /\d{3}-\d{3}-\d{4}/;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required !!'],
        unique: [true, 'username should be unique !!'],
    },
    userName: {
        firstName: {
            type: String,
            required: [true, 'First Name of user id required !!'],
        },
        middleName: { type: String },
        lastName: {
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
            message: "Password must be at least 8 characters long and contain at least one letter and one number",
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
    userProfilePicture: { type: 'Buffer' },
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
        return emails.length == new Set(emails).size;
    },
    message: 'Email Addresses of user should be unique !!',
});

userSchema.pre("save", async (next) => {
    if(!this.isModified("password"))return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async (userPassword) => {
    return await bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model("user", userSchema);