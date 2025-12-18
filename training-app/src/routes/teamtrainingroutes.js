const express = require('express');
const router = express.Router();
const teamTrainingController = require('../controller/teamTrainingController.js');

router.get('/', teamTrainingController.getAllTeamTraining)
router.post('/', teamTrainingController.addTeamToTraining);
router.delete("/:training_id/:team_id", teamTrainingController.deleteTeamFromTraining);
router.get('/lead', teamTrainingController.getAllTeamLeads);
router.get('/lead/:user_id', teamTrainingController.getLeadTeams);
router.get('/lead/:user_id/members', teamTrainingController.getLeadTeamTraining);
router.put("/due_date/:training_id/:team_id", teamTrainingController.updateTeamTrainingDueDate);


module.exports = router;
