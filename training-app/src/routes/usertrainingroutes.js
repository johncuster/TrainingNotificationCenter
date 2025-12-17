const express = require('express');
const router = express.Router();
const userTrainingController = require('../controller/userTrainingController.js')

router.get('/', userTrainingController.getAllUserTrainings); 
router.put('/update/:usertraining_id', userTrainingController.updateTraining);
router.get('/progress/:training_id', userTrainingController.getTrainingProgress); 
//router.post('/', userTeamController.addMemberToTeam);
//router.delete("/:team_id/:user_id", userTeamController.deleteMemberFromTeam);
router.put("/due_date/:training_id/:team_id", userTrainingController.updateDueDate);
router.get("/kpi/:userId", userTrainingController.getKpi);
//router.get("/:user_id", userTrainingController.getUserTrainingsWithTeams);




module.exports = router;