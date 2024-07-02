const { Router } = require('express');
const {
    getTeam,
    createTeam,
    updateTeam,
    deleteTeam,
} = require('../controllers/teamController');

const router = Router();

router.get('/team/getteam/:teamid', getTeam);
router.post('/team/createteam', createTeam);
router.put('/team/updateteam/:teamid', updateTeam);
router.delete('/team/deleteteam/:teamid', deleteTeam);

module.exports = router;