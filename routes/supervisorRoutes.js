const { Router } = require('express');
const {
    getSupervisor,
    addSupervisor,
    updateSupervisor,
    removeSupervisor,
} = require('../controllers/supervisorController');

const router = Router();

router.get('/supervisor/getsupervisor/:supervisorid', getSupervisor);
router.post('/supervisor/addsupervisor', addSupervisor);
router.put('/supervisor/updatesupervisor/:supervisorid', updateSupervisor);
router.delete('/supervisor/removesupervisor/:supervisorid', removeSupervisor);

module.exports = router;