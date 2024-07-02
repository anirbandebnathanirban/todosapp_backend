const { Router } = require('express');
const { 
    getTask, 
    createTask, 
    updateTask, 
    deleteTask 
} = require('../controllers/taskController');

const router = Router();

router.get('/task/gettask/:taskid', getTask);
router.post('/task/createtask', createTask);
router.put('/task/updatetask/:taskid', updateTask);
router.delete('/task/deletetask/:taskid', deleteTask);

module.exports = router;