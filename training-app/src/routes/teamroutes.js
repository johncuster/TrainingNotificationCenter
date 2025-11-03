const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamController.js')

//router.get('/', trainingController.getAllTrainings); 
//router.post('/', trainingController.createTraining);
//router.put('/:training_id', trainingController.updateTraining);
//router.delete('/:training_id', trainingController.deleteTraining);

router.get('/', teamController.getAllTeams);

module.exports = router;