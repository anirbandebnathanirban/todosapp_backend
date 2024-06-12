const { Router } = require('express');
const { signUp, signIn, getUser } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/user', authMiddleware, getUser);

module.exports = router;