const process = require('node:process');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const {
//     USER_NAME_IS_NOT_PROVIDED,
//     NAME_OF_USER_IS_NOT_PROVIDED,
//     USER_PRIMARY_EMAIL_IN_NOT_PROVIDED,
//     USER_PASSWORD_IS_NOT_PROVIDED,
//     USER_ALREADY_EXIST,
//     AUTHENTICATION_TOKEN_GENERATION_ERROR,
//     AUTHENTICATION_TOKEN_IS_GENERATED,
//     USER_NOT_EXIST,
//     USER_INVALID_CREDENTIAL,
//     USER_REGISTERED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_SAVE,
//     MONGODB_SERVER_ERROR_FINDONE,
//     MONGODB_SERVER_ERROR_FINDBYID,
//     USER_CREDENTIAL_VERIFIED,
//     INTERNAL_SERVER_ERROR_BCRYPT_COMPARE,
//     USER_VERIFIED_WITH_AUTHENTICATION_TOKEN,
// } = require('./statusCodes');

module.exports.signUp = (req, res) => {
    const { username, userName, userPrimaryEmail, userSecondaryEmails, userPassword, userContactNumber, userTasks, userTeams } = req.body;
    if(!username){
        return res.status(400).json({message: 'username is not provided'});
    }
    if(!userName){
        return res.status(400).json({message: 'name of user is not provided'});
    }
    if(!userPrimaryEmail){
        return res.status(400).json({message: 'user primary email is not provided'});
    }
    if(!userPassword){
        return res.status(400).json({message: 'user password is not provided'});
    }
    User.findOne({ $or: [{ username }, { userPrimaryEmail }]}).then(existingUser => {
        if(existingUser){
            return res.status(409).json({message: 'user already exist'});
        }
        const newUser = new User({ username, userName, userPrimaryEmail, userSecondaryEmails, userPassword, userContactNumber, userTasks, userTeams });
        console.log(newUser);
        newUser.save().then(user => {
            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (error, token) => {
                    if(error){
                        console.error(error);
                        return res.status(400).json({message: 'error in generating auth token of user !!', error});
                    }
                    console.log(token);
                    return res.status(200).json({message: 'user registered successfully and auth token is generated', token, user });
                }
            )
        }).catch(error => {
            console.error(error);
            return res.status(500).json({message: 'mongodb server error save', error});
        })
    }).catch(error => {
        console(error);
        return res.status(500).json({message: 'mongodb server error findOne', error});
    })
};

module.exports.signIn = (req, res) => {
    const { username, userPassword } = req.body;
    if(!username){
        return res.status(400).json({message: 'username is not provided'});
    }
    if(!userPassword){
        return res.status(400).json({message: 'user password is not provided'});
    }
    User.findOne({ username }).then(user => {
        if(!user){
            return res.status(404).json({message: 'user does not exist'});
        }
        bcrypt.compare(userPassword, user.userPassword).then(isMatch => {
            console.log(isMatch);
            if(!isMatch){
                return res.status(401).json({message: "user invalid credential"});
            }
            jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' },
                (error, token) => {
                    if(error){
                        console.error(error);
                        return res.status(400).json({message: 'error in generating auth token of user !!', error});
                    }
                    console.log(token);
                    return res.status(200).json({message: 'user credential is verified and auth token is generated', token, user });
                }
            )
        }).catch(error => {
            console.error(error);
            return res.status(500).json({message: 'internal server error bcrypt compare', error});
        })
    }).catch(error => {
        console.error(error);
        res.status(500).json({message: 'mongodb server error findOne', error});
    })
}

module.exports.getUser = async (req, res) => {
    User.findById(req.user.id).then(user => {
        if(!user){
            res.status(404).json({message: 'user does not exist'});
        }
        res.status(200).json({message: 'user verified with auth token', user });
    }).catch(error => {
        console.error(error);
        res.status(500).json({message: 'mongodb server error findById', error});
    })
}