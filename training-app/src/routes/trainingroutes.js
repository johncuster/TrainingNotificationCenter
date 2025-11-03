const express = require('express');
const router = express.Router();
const trainingController = require('../controller/trainingController.js')

router.get('/', trainingController.getAllTrainings); 
router.get('/:training_id/teams', trainingController.getTrainingTeams);
router.post('/', trainingController.createTraining);
router.put('/:training_id', trainingController.updateTraining);
router.delete('/:training_id', trainingController.deleteTraining);

module.exports = router;