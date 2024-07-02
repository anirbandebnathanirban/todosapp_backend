const Team = require('../models/teamModel');
const User = require('../models/userModel');
const {
    TEAM_NOT_FOUND,
    TEAM_FOUND_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYID,
    TEAMNAME_IS_NOT_PROVIDED,
    TEAM_BASICDETAILS_IS_NOT_PROVIDED,
    TEAM_MEMBERS_IS_NOT_PROVIDED,
    TEAM_LEADER_IS_NOT_PROVIDED,
    TEAM_MEMBER_NOT_FOUND_IN_USER_DATABASE,
    MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
    TEAM_CREATED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_SAVE,
    TEAM_UPDATED_SUCCESSFULLY,
    TEAM_DELETED_SUCCESSFULLY,
    MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
} = require('./statusCodes');

module.exports.getTeam = (req, res) => {
    const teamId = req.param.teamid;
    Team.findById(teamId).then(team => {
        if(!team){
            res.status(TEAM_NOT_FOUND).json({message: 'team not found'});
        }
        res.status(TEAM_FOUND_SUCCESSFULLY).json({ team });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYID).json({message: 'mongoDB server error findById', error});
    });
}

module.exports.createTeam = (req, res) => {
    const { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings } = req.body;
    if(!teamName){
        res.status(TEAMNAME_IS_NOT_PROVIDED).json({message: 'team name is not provided'});
    }
    if(!teamBasicDetails){
        res.status(TEAM_BASICDETAILS_IS_NOT_PROVIDED).json({message: 'team basic details is not provided'});
    }
    if(!teamMembers){
        res.status(TEAM_MEMBERS_IS_NOT_PROVIDED).json({message: 'team members is not provided'});
    }
    if(!teamLeader){
        res.status(TEAM_LEADER_IS_NOT_PROVIDED).json({message: 'team leader is not provided'});
    }
    const newTeam = new Team({ teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings });
    newTeam.save().then(team => {
        team.teamMembers.forEach(teamMember => {
            User.findByIdAndUpdate(
                teamMember,
                { $push: {  userTeams: team._id }},
            ).then(updatedUser => {
                if(!updatedUser){
                    res.status(TEAM_MEMBER_NOT_FOUND_IN_USER_DATABASE).json({message: 'team member is not found is user database'});
                }
            }).catch(error => {
                res.status(MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        });
        res.status(TEAM_CREATED_SUCCESSFULLY).json({ team });
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_SAVE).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateTeam = (req, res) => {
    const teamId = req.param.teamid;
    const { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings } = req.body;
    Team.findByIdAndUpdate(
        teamId,
        { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings },
    ).then(updatedTeam => {
        if(!updatedTeam){
            res.status(TEAM_NOT_FOUND).json({message: 'team not found'});
        }
        res.status(TEAM_UPDATED_SUCCESSFULLY).json({message: 'team updated successfully', updatedTeam});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.deleteTeam = (req, res) => {
    const teamId = req.param.teamid;
    Team.findByIdAndDelete(teamId).then(deletedTeam => {
        if(!deletedTeam){
            res.status(TEAM_NOT_FOUND).json({message: 'team not found'});
        }
        res.status(TEAM_DELETED_SUCCESSFULLY).json({message: 'team deleted successfully', deletedTeam});
    }).catch(error => {
        res.status(MONGODB_SERVER_ERROR_FINDBYIDANDDELETE).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}