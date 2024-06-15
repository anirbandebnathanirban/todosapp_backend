const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const url = require('node:url');
const fs = require('node:fs');

const isValidURL = (inputURL) => {
    try {
        new url(inputURL);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const isValidFilePath = (inputFilePath) => {
    return fs.existsSync(inputFilePath) && fs.lstatSync(inputFilePath);
}

const taskSchema = new mongoose.Schema({
    taskTitle: {
        type: String,
        required: [true, 'Task Title is required !!'],
    },
    taskBasicDetails: {
        taskDescription: { type: String },
        taskStatus: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed'],
            default: 'pending',
        },
        taskPriority: {
            type: String,
            enum: ['Low', 'Moderate', 'High'],
            default: 'Moderate',
        },
    },
    taskTimingAndSchedule: {
        taskCreationTime: {
            type: Date,
            required: [true, 'Task Creation Time is requird !!'],
            default: Date.now(),
        },
        taskStartTime: {
            type: Date,
            required: [true, 'Task Start Time is required !!'],
            default: Date.now(),
        },
        taskDueTime: { type: Date },
        taskEndTime: { type: Date },
    },
    taskSupervisor: [{
        type: Schema.Types.ObjectId,
        ref: 'supervisor',
    }],
    taskTeam: {
        type: Schema.Types.ObjectId,
        ref: 'team',
    },
    taskEstimatedTime: { type: Number },
    taskResources: {
        taskAttachmentsAndLinks: {
            type: String,
            validate: {
                validator: function(value) {
                    return isValidURL(value) || isValidFilePath(value);
                },
                message: 'Please Enter a valid URL or File Path!!',
            },
        },
        taskMaterials: {
            taskMaterialsName: { type: String },
            taskMaterialsContent: { type: 'Buffer' },
        }
    }
    
}, {timestamps: true});

module.exports = mongoose.model("task", taskSchema);