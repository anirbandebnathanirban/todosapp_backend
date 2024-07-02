const Task = require('../models/taskModel');
const User = require('../models/userModel');
const {
    TASK_FETCHED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYID,
    TASK_CREATOR_IS_NOT_PROVIDED,
    TASK_TITLE_IS_NOT_PROVIDED,
    TASK_BASICDETAILS_IS_NOT_PROVIDED,
    TASK_TIMINGANDSCHEDULE_IS_NOT_PROVIDED,
    USER_NOT_EXIST,
    MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
    MONGODB_SERVER_ERROR_SAVE,
    TASK_CREATED_SUCCESSFULLY,
    TASK_UPDATED_SUCCESSFULLY,
    TASK_NOT_FOUND,
    TASK_DELETED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
} = require('./statusCodes');

module.exports.getTask = async (req, res) => {
    const taskId = req.param.taskid;
    Task.findById(taskId).then(task => {
        res.status(TASK_FETCHED_SUCCESSFULLY).json({ task });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYID).json({message: 'mongoDB server error findById', error});
    })
}

module.exports.createTask = async (req, res) => {
    const { taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime } = req.body;
    if(!taskCreator){
        res.status(TASK_CREATOR_IS_NOT_PROVIDED).json({message: 'task creator is not provided'});
    }
    if(!taskTitle){
        res.status(TASK_TITLE_IS_NOT_PROVIDED).json({message: 'task title is not provided'});
    }
    if(!taskBasicDetails){
        res.status(TASK_BASICDETAILS_IS_NOT_PROVIDED).json({message: 'task basic details is not provided'});
    }
    if(!taskTimingAndSchedule){
        res.status(TASK_TIMINGANDSCHEDULE_IS_NOT_PROVIDED).json({message: 'task timing and schedule is not provided'});
    }
    const newTask = new Task({ taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime });
    newTask.save().then(task => {
        User.findByIdAndUpdate(
            taskCreator,
            { $push: {  userTasks: task._id }}
        ).then(updatedUser => {
            if(!updatedUser){
                res.status(USER_NOT_EXIST).json({message: 'user not exist'});
            }
            res.status(TASK_CREATED_SUCCESSFULLY).json({message: 'task created successfully', task });
        }).catch(error => {
            res.status(MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE).json({message: 'mongoDB server error findByIdAndUpdate', error});
        })
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_SAVE).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateTask = (req, res) => {
    const taskId = req.param.taskid;
    const {  taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime } = req.body;
    Task.findByIdAndUpdate(
        taskId,
        { taskCreator, taskTitle, taskBasicDetails, taskTimingAndSchedule, taskSupervisor, taskTeam, taskEstimatedTime },
    ).then(task => {
        if(!task){
            res.status(TASK_NOT_FOUND).json({message: 'task not found'});
        }
        res.status(TASK_UPDATED_SUCCESSFULLY).json({ message: 'task updated successfully', task});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.deleteTask = (req, res) => {
    const taskId = req.param.taskid;
    Task.findByIdAndDelete(taskId).then(deletedTask => {
        if(!deletedTask){
            res.status(TASK_NOT_FOUND).json({message: 'task not found'});
        }
        res.status(TASK_DELETED_SUCCESSFULLY).json({message: 'task deleted successfully', deletedTask});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDDELETE).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}