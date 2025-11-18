const express = require('express');
const router = express.Router();
const userTrainingController = require('../controller/userTrainingController.js')

router.get('/', userTrainingController.getAllUserTrainings); 
router.put('/update/:usertraining_id', userTrainingController.updateTraining);
router.get('/progress/:training_id', userTrainingController.getTrainingProgress); 
//router.post('/', userTeamController.addMemberToTeam);
//router.delete("/:team_id/:user_id", userTeamController.deleteMemberFromTeam);

module.exports = router;