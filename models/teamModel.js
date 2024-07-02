const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    teamName: {
        type: String,
        required: [true, 'Team name id required !!'],
    },
    teamBasicDetails: {
        teamDescription: { type: String },
        teamCreationTime: {
            type: Date,
            required: [true, 'Team Creation Time is required !!'],
            default: Date.now(),
        },
        teamLastModificationTime: {
            type: Date,
            required: [true, 'Team Last Modification Time is required !!']
        }
    },
    teamMembers: [{
        type: Schema.Types.ObjectId,
        ref: 'user',
    }],
    teamLeader: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: [true, 'Leader of the team is required !!'],
    },
    teamTasks: [{
        type: Schema.Types.ObjectId,
        ref: 'task',
    }],
    teamMettings: [{
        date: { 
            type: Date,
            required: [true, 'Team Metting held date is required !!'],
        },
        notes: { 
            type: String,
            required: [true, 'Some notes for team meetings is required !!'],
        },
    }]
}, { timestamps: true });

teamSchema.path('teamMembers').validate({
    validator: function(members) {
        return members.length >= 2;
    },
    message: 'Team size should be atleast 2 !!',
});

module.exports = mongoose.model('team', teamSchema);