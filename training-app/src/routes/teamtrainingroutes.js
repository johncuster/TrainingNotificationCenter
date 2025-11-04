const express = require('express');
const router = express.Router();
const teamTrainingController = require('../controller/teamTrainingController.js');

// Assign a team to a training
router.get('/', teamTrainingController.getAllTeamTraining)
router.post('/', teamTrainingController.addTeamToTraining);
router.delete("/:training_id/:team_id", teamTrainingController.deleteTeamFromTraining);

module.exports = router;
