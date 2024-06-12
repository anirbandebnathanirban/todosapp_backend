const Task = require('../models/taskModel');

module.exports.getTask = async (req, res) => {
    const username = req.param.username;
    try {
        const tasks = await Task.find({ username });
        res.json({ tasks });
    } catch (error) {
        res.status(701).json({
            message: "Error in fetching the task list",
            error: error.message
        });
    }
}

module.exports.createTask = async (req, res) => {
    const username = req.param.username;
    const { taskId, taskTitle, creationTime, dueTime, isDone } = req.body;
    try {
        const task = new Task({ username, taskId, taskTitle, creationTime, dueTime, isDone });
        await task.save();
        res.json({message: "Task created successfullty"});
    } catch (error) {
        res.status(703).json({
            message: "Error in Task Creation",
            error: error.message
        });
    }
}

module.exports.updateTask = async (req, res) => {
    const username = req.param.username;
    const { taskId, taskTitle, creationTime, dueTime, isDone } = req.body;
    try {
        const task = await Task.findOneAndUpdate(
            { username, taskId },
            { taskTitle, creationTime, dueTime, isDone },
        )
        if(!task){
            res.status(705).json({message: "Task not found"});
        }
        res.json({message: "Task updated successfully"});
    } catch (error) {
        res.status(707).json({
            message: "Error in Finding or Updating the task",
            error: error.message
        });
    }
}

module.exports.deleteTask = async (req, res) => {
    const username = req.param.username;
    const taskId = req.param.taskid;
    try {
        const task = Task.findOneAndDelete({ username, taskId });
        if(!task){
            res.status(709).json({message: "Task not found"});
        }
        res.json({message: "Task deleted successfully"});
    } catch (error) {
        res.status(711).json({
            message: "Error in Finding or Deleting the task",
            error: error.message
        });
    }
}