const { Router } = require('express');
const { getTask, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = Router();

router.get('/gettask/:username', getTask);
router.post('/createtask/:username', createTask);
router.put('/updatetask/:username', updateTask);
router.delete('/deletetask/:username/:taskid', deleteTask);

module.exports = router;