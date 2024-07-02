const process = require('node:process');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    USER_NAME_IS_NOT_PROVIDED,
    NAME_OF_USER_IS_NOT_PROVIDED,
    USER_PRIMARY_EMAIL_IN_NOT_PROVIDED,
    USER_PASSWORD_IS_NOT_PROVIDED,
    USER_ALREADY_EXIST,
    AUTHENTICATION_TOKEN_GENERATION_ERROR,
    AUTHENTICATION_TOKEN_IS_GENERATED,
    USER_NOT_EXIST,
    USER_INVALID_CREDENTIAL,
    USER_REGISTERED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_SAVE,
    MONGODB_SERVER_ERROR_FINDONE,
    MONGODB_SERVER_ERROR_FINDBYID,
    USER_CREDENTIAL_VERIFIED,
    INTERNAL_SERVER_ERROR_BCRYPT_COMPARE,
    USER_VERIFIED_WITH_AUTHENTICATION_TOKEN,
} = require('./statusCodes');

module.exports.signUp = (req, res) => {
    const { username, userName, userPrimaryEmail, userSecondaryEmails, userPassword, userContactNumber, userTasks, userTeams } = req.body;
    if(!username){
        res.status(USER_NAME_IS_NOT_PROVIDED).json({message: 'username is not provided'});
    }
    if(!userName){
        res.status(NAME_OF_USER_IS_NOT_PROVIDED).json({message: 'name of user is not provided'});
    }
    if(!userPrimaryEmail){
        res.status(USER_PRIMARY_EMAIL_IN_NOT_PROVIDED).json({message: 'user primary email is not provided'});
    }
    if(!userPassword){
        res.status(USER_PASSWORD_IS_NOT_PROVIDED).json({message: 'user password is not provided'});
    }
    User.findOne({ $or: [{ username }, { userPrimaryEmail }]}).then(user => {
        if(user){
            res.status(USER_ALREADY_EXIST).json({message: 'user already exist'});
        }
        const newUser = new User({ username, userName, userPrimaryEmail, userSecondaryEmails, userPassword, userContactNumber, userTasks, userTeams });
        newUser.save().then(user => {
            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if(err){
                        res.status(AUTHENTICATION_TOKEN_GENERATION_ERROR).json({message: 'error in generating authentication token of user !!'});
                    }
                    res.status(AUTHENTICATION_TOKEN_IS_GENERATED).json({ token });
                }
            )
            res.status(USER_REGISTERED_SUCCESSFULLY).json({ message: 'user registered successfully'});
        }).catch(error => {
            res.status(MONGODB_SERVER_ERROR_SAVE).json({message: 'mongodb server error save', error});
        })
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDONE).json({message: 'mongodb server error findOne', error});
    })
};

module.exports.signIn = (req, res) => {
    const { username, userPassword } = req.body;
    if(!username){
        res.status(USER_NAME_IS_NOT_PROVIDED).json({message: 'username is not provided'});
    }
    if(!userPassword){
        res.status(USER_PASSWORD_IS_NOT_PROVIDED).json({message: 'user password is not provided'});
    }
    User.findOne({ username }).then(user => {
        if(!user){
            res.status(USER_NOT_EXIST).json({message: 'user does not exist'});
        }
        bcrypt.compare(userPassword, user.userPassword).then(isMatch => {
            if(!isMatch){
                res.status(USER_INVALID_CREDENTIAL).json({message: "user invalid credential"});
            }
            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (err, token) => {
                    if(err){
                        res.status(AUTHENTICATION_TOKEN_GENERATION_ERROR).json({message: 'error in generating authentication token of user !!'})
                    }
                    res.status(AUTHENTICATION_TOKEN_IS_GENERATED).json({ token });
                }
            )
            res.status(USER_CREDENTIAL_VERIFIED).json({message: 'user credentila verified'});
        }).catch(error => {
            res.status(INTERNAL_SERVER_ERROR_BCRYPT_COMPARE).json({message: 'internal server error bcrypt compare', error});
        })
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDONE).json({message: 'mongodb server error findOne', error});
    })
}

module.exports.getUser = async (req, res) => {
    User.findById(req.user.id).then(user => {
        res.status(USER_VERIFIED_WITH_AUTHENTICATION_TOKEN).json({ user });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYID).json({message: 'mongodb server error findById', error});
    })
}