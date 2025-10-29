const express = require('express');
const router = express.Router();
const trainingController = require('../controller/trainingController.js')

router.get('/', trainingController.getAllTrainings); 
router.post('/', trainingController.createTraining);
router.put('/:training_id', trainingController.updateTraining);
router.delete('/:training_id', trainingController.deleteTraining);

module.exports = router;