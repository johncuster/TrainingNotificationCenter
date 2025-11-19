const express = require('express');
const router = express.Router();
const teamTrainingController = require('../controller/teamTrainingController.js');

// Assign a team to a training
router.get('/', teamTrainingController.getAllTeamTraining)
router.post('/', teamTrainingController.addTeamToTraining);
router.delete("/:training_id/:team_id", teamTrainingController.deleteTeamFromTraining);
router.get('/lead', teamTrainingController.getAllTeamLeads);
router.get('/lead/:user_id', teamTrainingController.getLeadTeams);
router.get('/lead/:user_id/members', teamTrainingController.getLeadTeamTraining);

module.exports = router;
