const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        ref: "user"
    },
    taskId: {
        type: String,
        required: true,
    },
    taskTitle: {
        type: String,
        required: true,
    },
    creationTime: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    dueTime: {
        type: String,
        required: true,
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model("task", taskSchema);