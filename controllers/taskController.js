const Task = require('../models/taskModel');
const User = require('../models/userModel');
const Team = require('../models/teamModel');
// const {
//     TASK_FETCHED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYID,
//     TASK_CREATOR_IS_NOT_PROVIDED,
//     TASK_TITLE_IS_NOT_PROVIDED,
//     TASK_BASICDETAILS_IS_NOT_PROVIDED,
//     TASK_TIMINGANDSCHEDULE_IS_NOT_PROVIDED,
//     USER_NOT_EXIST,
//     MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
//     MONGODB_SERVER_ERROR_SAVE,
//     TASK_CREATED_SUCCESSFULLY,
//     TASK_UPDATED_SUCCESSFULLY,
//     TASK_NOT_FOUND,
//     TASK_DELETED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
//     TEAM_NOT_FOUND,
// } = require('./statusCodes');

module.exports.getTask = (req, res) => {
    const taskId = req.params.taskid;
    Task.findById(taskId).then(task => {
        if(!task){
            return res.status(404).json({message: 'task not found'});
        }
        console.log(task);
        return res.status(200).json({message: 'task fetched successfully', task });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.createTask = (req, res) => {
    const { taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime } = req.body;
    if(!taskCreator){
        return res.status(400).json({message: 'task creator is not provided'});
    }
    if(!taskTitle){
        return res.status(400).json({message: 'task title is not provided'});
    }
    if(!taskBasicDetails){
        return res.status(400).json({message: 'task basic details is not provided'});
    }
    if(!taskTimingAndSchedule){
        return res.status(400).json({message: 'task timing and schedule is not provided'});
    }
    const newTask = new Task({ taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime });
    console.log(newTask);
    newTask.save().then(task => {
        if(taskTeam != null) {
            Team.findByIdAndUpdate(
                taskTeam,
                { $push : { teamTasks : task._id } },
            ).then(updatedTeam => {
                if(!updatedTeam) {
                    return res.status(404).json({message: 'team not found'});
                }
                updatedTeam.teamMembers.forEach(teamMember => {
                    User.findByIdAndUpdate(
                        teamMember,
                        { $push : { userTasks : task._id } },
                    ).then(updatedTeamMember => {
                        console.log('team member is updated successfully');
                        console.log(updatedTeamMember);
                    }).catch(error => {
                        return res.status(500).json({message: 'some error occurs while updating team members', error});
                    })
                })
                return res.status(200).json({message: 'task created successfully', task});
            }).catch(error => {
                return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        }
        else {
            User.findByIdAndUpdate(
                taskCreator,
                { $push : { userTasks : task._id } },
            ).then(updatedUser => {
                console.log(updatedUser);
                return res.status(200).json({message: 'task created successfully', task, updatedUser});
            }).catch(error => {
                return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        }
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateTask = (req, res) => {
    const taskId = req.params.taskid;
    console.log(taskId);
    const {  taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime } = req.body;
    Task.findByIdAndUpdate(
        taskId,
        { taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime },
    ).then(updatedTask => {
        if(!updatedTask){
            return res.status(404).json({message: 'task not found'});
        }
        console.log(updatedTask);
        return res.status(200).json({ message: 'task updated successfully', updatedTask});
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.deleteTask = (req, res) => {
    const taskId = req.params.taskid;
    Task.findByIdAndDelete(taskId).then(deletedTask => {
        if(!deletedTask){
            return res.status(404).json({message: 'task not found'});
        }
        console.log(deletedTask);
        if(deletedTask.taskTeam != null) {
            Team.findByIdAndUpdate(
                deletedTask.taskTeam,
                { $pull : { teamTasks : deletedTask._id } },
            ).then(updatedTeam => {
                if(!updatedTeam) {
                    return res.status(404).json({message: 'team not found'});
                }
                updatedTeam.teamMembers.forEach(teamMember => {
                    User.findByIdAndUpdate(
                        teamMember,
                        { $pull : { userTasks : deletedTask._id } },
                    ).then(updatedTeamMember => {
                        console.log('team member is updated successfully');
                        console.log(updatedTeamMember);
                    }).catch(error => {
                        return res.status(500).json({message: 'some error occurs while updating team members', error});
                    })
                })
                return res.status(200).json({message: 'task deleted successfully', deletedTask});
            }).catch(error => {
                return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        }
        else {
            User.findByIdAndUpdate(
                deletedTask.taskCreator,
                { $pull : { userTasks : deletedTask._id } },
            ).then(updatedUser => {
                return res.status(200).json({message: 'task deleted successfully', deletedTask, updatedUser});
            }).catch(error => {
                return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        }
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}