const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value) {
                return emailRegex.test(value);
            },
            message: "Please Enter a valid Email Address !!",
        },
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return passwordRegex.test(value);
            },
            message: "Password must be at least 8 characters long and contain at least one letter and one number",
        }
    },
}, {timestamps: true});

userSchema.pre("save", async (next) => {
    if(!this.isModified("password"))return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.methods.comparePassword = async (userPassword) => {
    return await bcrypt.compare(userPassword, this.password);
}

module.exports = mongoose.model("user", userSchema);