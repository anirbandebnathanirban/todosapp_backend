const Team = require('../models/teamModel');
const User = require('../models/userModel');
// const {
//     TEAM_NOT_FOUND,
//     TEAM_FOUND_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYID,
//     TEAMNAME_IS_NOT_PROVIDED,
//     TEAM_BASICDETAILS_IS_NOT_PROVIDED,
//     TEAM_MEMBERS_IS_NOT_PROVIDED,
//     TEAM_LEADER_IS_NOT_PROVIDED,
//     TEAM_MEMBER_NOT_FOUND_IN_USER_DATABASE,
//     MONGODB_SERVER_ERROR_FINDBYIDANDUPDATE,
//     TEAM_CREATED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_SAVE,
//     TEAM_UPDATED_SUCCESSFULLY,
//     TEAM_DELETED_SUCCESSFULLY,
//     MONGODB_SERVER_ERROR_FINDBYIDANDDELETE,
// } = require('./statusCodes');

module.exports.getTeam = (req, res) => {
    const teamId = req.params.teamid;
    Team.findById(teamId).then(team => {
        if(!team){
            return res.status(404).json({message: 'team not found'});
        }
        console.log(team);
        return res.status(200).json({message: 'team found successfully', team });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findById', error});
    });
}

module.exports.createTeam = (req, res) => {
    const { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings } = req.body;
    if(!teamName){
        return res.status(400).json({message: 'team name is not provided'});
    }
    if(!teamBasicDetails){
        return res.status(400).json({message: 'team basic details is not provided'});
    }
    if(!teamMembers){
        return res.status(400).json({message: 'team members is not provided'});
    }
    if(!teamLeader){
        return res.status(400).json({message: 'team leader is not provided'});
    }
    const newTeam = new Team({ teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings });
    console.log(newTeam);
    newTeam.save().then(team => {
        team.teamMembers.forEach(teamMember => {
            User.findByIdAndUpdate(
                teamMember,
                { $push: {  userTeams: team._id }},
            ).then(updatedUser => {
                if(!updatedUser){
                    return res.status(404).json({message: 'team member is not found is user database'});
                }
                console.log(updatedUser);
            }).catch(error => {
                console.error(error);
                return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
            })
        });
        return res.status(200).json({message: 'team created successfully', team });
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error save', error});
    })
}

module.exports.updateTeam = (req, res) => {
    const teamId = req.params.teamid;
    const { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings } = req.body;
    Team.findByIdAndUpdate(
        teamId,
        { teamName, teamBasicDetails, teamMembers, teamLeader, teamTasks, teamMettings },
    ).then(updatedTeam => {
        if(!updatedTeam){
            return res.status(404).json({message: 'team not found'});
        }
        console.log(updatedTeam);
        return res.status(200).json({message: 'team updated successfully', updatedTeam});
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndUpdate', error});
    })
}

module.exports.deleteTeam = (req, res) => {
    const teamId = req.params.teamid;
    Team.findByIdAndDelete(teamId).then(deletedTeam => {
        if(!deletedTeam){
            return res.status(404).json({message: 'team not found'});
        }
        console.log(deletedTeam);
        return res.status(200).json({message: 'team deleted successfully', deletedTeam});
    }).catch(error => {
        console.error(error);
        return res.status(500).json({message: 'mongoDB server error findByIdAndDelete', error});
    })
}