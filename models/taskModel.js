const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const url = require('node:url');
// const fs = require('node:fs');

// const isValidURL = (inputURL) => {
//     try {
//         new url(inputURL);
//         return true;
//     } catch (error) {
//         console.log(error);
//         return false;
//     }
// };

// const isValidFilePath = (inputFilePath) => {
//     return fs.existsSync(inputFilePath) && fs.lstatSync(inputFilePath);
// }

const taskSchema = new mongoose.Schema({
    taskCreator: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    taskTitle: {
        type: String,
        required: [true, 'Task Title is required !!'],
    },
    taskBasicDetails: {
        taskDescription: { type: String },
        taskStatus: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Not Completed'],
            default: 'pending',
        },
        taskPriority: {
            type: String,
            enum: ['Low', 'Moderate', 'High'],
            default: 'Moderate',
        },
    },
    taskTimingAndSchedule: {
        taskCreationTime: { // The date and time when the task was created.
            type: Date,
            required: [true, 'Task Creation Time is requird !!'],
            default: Date.now(),
        },
        taskStartTime: { // The date and time when the task is scheduled to start.
            type: Date,
            required: [true, 'Task Start Time is required !!'],
            default: Date.now(),
        },
        taskEndTime: { type: Date }, // The date and time when the task is scheduled to end or was completed.
        taskDueTime: { // The date and time by which the task should be completed.
            type: Date, 
            required: [true, 'Task Due Time is required !!'],
        },
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
    // taskResources: {
    //     taskAttachmentsAndLinks: {
    //         type: String,
    //         validate: {
    //             validator: function(value) {
    //                 return isValidURL(value) || isValidFilePath(value);
    //             },
    //             message: 'Please Enter a valid URL or File Path!!',
    //         },
    //     },
    //     taskMaterials: {
    //         taskMaterialsName: { type: String },
    //         taskMaterialsContent: { type: 'Buffer' },
    //     }
    // }
    
}, {timestamps: true});

module.exports = mongoose.model("task", taskSchema);