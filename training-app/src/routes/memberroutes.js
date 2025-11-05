const express = require('express');
const router = express.Router();
const memberController = require('../controller/memberController.js')

//router.get('/', trainingController.getAllTrainings); 
//router.post('/', trainingController.createTraining);
//router.put('/:training_id', trainingController.updateTraining);
router.delete('/:user_id', memberController.deleteMember);
router.get('/', memberController.getAllMembers);
router.post('/', memberController.createMember);
router.put('/:user_id', memberController.updateMember)

module.exports = router;