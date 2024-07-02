const { Router } = require('express');
const { 
    signUp, 
    signIn, 
    getUser 
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post('/auth/signup', signUp);
router.post('/auth/signin', signIn);
router.get('/auth/getuser', authMiddleware, getUser);

module.exports = router;   