const User = require('../models/userModel');
const { generateToken } = require('../utils/authUtils');

module.exports.signUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ username, email });
        if(user){
            res.status(301).json({message: 'User already exist'});
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        const token = generateToken(newUser._id);
        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({message: error.message});
    } 
};

module.exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user || !(await user.comparePassword(password))){
            return res.status(501).json({message: "Invalid Email or Password"});
        }
        const token = generateToken(user._id);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports.getUser = async (req, res) => {
    const user = await req.user; 
    res.json({user});
}