const Supervisor = require('../models/supervisorModel');
// const { 
//     SUPERVISOR_NOT_FOUND,
//     SUPERVISOR_FOUND_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYID,
//     SUPERVISOR_NAME_IS_NOT_PROVIDED,
//     SUPERVISOR_PRIMARYEMAIL_IS_NOT_PROVIDED,
//     SUPERVISOR_ADDED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_SAVE,
//     SUPERVISOR_UPDATED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
//     SUPERVISOR_REMOVED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
//     FETCH_ALL_SUPERVISOR_IS_SUCCESSFUL,
//     MONGODB_SERVER_ERROR_FIND,
// } = require('./statusCodes');

module.exports.getSupervisor = (req, res) => {
    const supervisorId = req.params.supervisorid;
    Supervisor.findById(supervisorId).then(supervisor => {
        if(!supervisor){
            return res.status(404).json({message: 'supervisor not found'});
        }
        console.log(supervisor);
        return res.status(200).json({message: 'supervisor found successfully', supervisor });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.getAllSupervisor = (req, res) => {
    Supervisor.find().then(supervisors => {
        console.log(supervisors);
        return res.status(200).json({message: 'fetching of all supervisor is successful', supervisors });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error find', error});
    })
}

module.exports.addSupervisor = (req, res) => {
    const { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber } = req.body;
    if(!supervisorName){
        return res.status(400).json({message: 'supervisor name is not provided'});
    }
    if(!supervisorPrimaryEmail){
        return res.status(400).json({message: 'supervisor primary email is not provided'});
    }
    const newSupervisor = new Supervisor({ supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber });
    console.log(newSupervisor);
    newSupervisor.save().then(supervisor => {
        console.log(supervisor);
        return res.status(200).json({message: 'supervisor is added successfully', supervisor });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateSupervisor = (req, res) => {
    const supervisorId = req.params.supervisorid;
    const { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber } = req.body;
    Supervisor.findByIdAndUpdate(
        supervisorId,
        { supervisorName, supervisorPrimaryEmail, supervisorSecondaryEmails, supervisorContactNumber },
    ).then(updatedSupervisor => {
        if(!updatedSupervisor){
            res.status(404).json({message: 'supervisor not found'});
        }
        console.log(updatedSupervisor);
        return res.status(200).json({ message: 'supervisor updated successfully', updatedSupervisor});
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.removeSupervisor = (req, res) => {
    const supervisorId = req.params.supervisorid;
    Supervisor.findByIdAndDelete(supervisorId).then(deletedSupervisor => {
        if(!deletedSupervisor){
            return res.status(404).json({message: 'supervisor not found'});
        }
        console.log(deletedSupervisor);
        return res.status(200).json({message: 'supervisor removed successfully', deletedSupervisor});
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}