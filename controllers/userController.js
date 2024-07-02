const User = require('../models/userModel');
const {
    FETCH_ALL_USERS_IS_SUCCESSFUL,
    MONGODB_SERVER_ERROR_FIND,
    USER_NOT_EXIST,
    USER_FOUND_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYID,
} = require('./statusCodes');

module.exports.getUser = (req, res) => {
    const userId = req.param.userId;
    User.findById(userId).then(user => {
        if(!user){
            res.status(USER_NOT_EXIST).json({message: 'user does not exist'});
        }
        res.status(USER_FOUND_SUCCESSFULLY).json({ user });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYID).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.getAllUser = (req, res) => {
    User.find().then(users => {
        res.status(FETCH_ALL_USERS_IS_SUCCESSFUL).json({ users });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FIND).json({message: 'mongoDB server error find', error});
    })
}