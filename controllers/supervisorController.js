const Supervisor = require('../models/supervisorModel');
const { 
    SUPERVISOR_NOT_FOUND,
    SUPERVISOR_FOUND_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYID,
    SUPERVISOR_NAME_IS_NOT_PROVIDED,
    SUPERVISOR_PRIMARYEMAIL_IS_NOT_PROVIDED,
    SUPERVISOR_ADDED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_SAVE,
    SUPERVISOR_UPDATED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
    SUPERVISOR_REMOVED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
    FETCH_ALL_SUPERVISOR_IS_SUCCESSFUL,
    MONGODB_SERVER_ERROR_FIND,
} = require('./statusCodes');

module.exports.getSupervisor = (req, res) => {
    const supervisorId = req.param.supervisorid;
    Supervisor.findById(supervisorId).then(supervisor => {
        if(!supervisor){
            res.status(SUPERVISOR_NOT_FOUND).json({message: 'supervisor not found'});
        }
        res.status(SUPERVISOR_FOUND_SUCCESSFULLY).json({ supervisor });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYID).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.getAllSupervisor = (req, res) => {
    Supervisor.find().then(supervisors => {
        res.status(FETCH_ALL_SUPERVISOR_IS_SUCCESSFUL).json({ supervisors });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FIND).json({message: 'mongoDB server error find', error});
    })
}

module.exports.addSupervisor = (req, res) => {
    const { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber } = req.body;
    if(!supervisorName){
        res.status(SUPERVISOR_NAME_IS_NOT_PROVIDED).json({message: 'supervisor name is not provided'});
    }
    if(!supervisorPrimaryEmail){
        res.status(SUPERVISOR_PRIMARYEMAIL_IS_NOT_PROVIDED).json({message: 'supervisor primary email is not provided'});
    }
    const newSupervisor = new Supervisor({ supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber });
    newSupervisor.save().then(supervisor => {
        res.status(SUPERVISOR_ADDED_SUCCESSFULLY).json({ supervisor });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_SAVE).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateSupervisor = (req, res) => {
    const supervisorId = req.param.supervisorid;
    const { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber } = req.body;
    Supervisor.findByIdAndUpdate(
        supervisorId,
        { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber },
    ).then(updatedSupervisor => {
        if(!updatedSupervisor){
            res.status(SUPERVISOR_NOT_FOUND).json({message: 'supervisor not found'});
        }
        res.status(SUPERVISOR_UPDATED_SUCCESSFULLY).json({ message: 'supervisor updated successfully', updatedSupervisor});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.removeSupervisor = (req, res) => {
    const supervisorId = req.param.supervisorid;
    Supervisor.findByIdAndDelete(supervisorId).then(deletedSupervisor => {
        if(!deletedSupervisor){
            res.status(SUPERVISOR_NOT_FOUND).json({message: 'supervisor not found'});
        }
        res.status(SUPERVISOR_REMOVED_SUCCESSFULLY).json({message: 'supervisor removed successfully', deletedSupervisor});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDDELETE).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}