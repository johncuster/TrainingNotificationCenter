const express = require('express');
const router = express.Router();
const teamController = require('../controller/teamController.js')

//router.get('/', trainingController.getAllTrainings); 
//router.post('/', trainingController.createTraining);
//router.put('/:training_id', trainingController.updateTraining);
router.delete('/:team_id', teamController.deleteTeam);
router.get('/', teamController.getAllTeams);
router.post('/', teamController.createTeam);
router.put('/:team_id', teamController.updateTeam);
router.get('/:team_id/members', teamController.getTeamMembers);

module.exports = router;