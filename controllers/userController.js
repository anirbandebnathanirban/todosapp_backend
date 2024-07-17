const User = require('../models/userModel');
// const {
//     FETCH_ALL_USERS_IS_SUCCESSFUL,
//     MONGODB_SERVER_ERROR_FIND,
//     USER_NOT_EXIST,
//     USER_FOUND_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYID,
// } = require('./statusCodes');

module.exports.getUser = (req, res) => {
    const userId = req.params.userid;
    User.findById(userId).then(user => {
        if(!user){
            return res.status(404).json({message: 'user does not exist'});
        }
        console.log(user);
        return res.status(200).json({message: 'user found successfully', user });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.getAllUser = (req, res) => {
    User.find().then(users => {
        console.log(users);
        res.status(200).json({message: 'fetching of all users is successfull', users });
    }).catch(error => {
        console.error(error);
        res.status(500).json({message: 'mongoDB server error find', error});
    })
}