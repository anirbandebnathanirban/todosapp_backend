const { Router } = require('express');
const {
    getUser,
    getAllUser,
} = require('../controllers/userController');

const router = Router();

router.get('/user/getuser/:userid', getUser);
router.get('/user/getalluser', getAllUser);

module.exports = router;