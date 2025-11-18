const express = require("express");
const router = express.Router();
const syncController = require("../controller/syncController");

// 1. Assign training to a team
router.post("/syncteamtraining", syncController.syncTeamToTraining);

// 2. Sync new user to team trainings
router.post("/user-to-team-trainings", syncController.syncUserToTeamTrainings);

// 3. Remove team from training
router.delete("/remove-team-from-training/:team_id/:training_id", syncController.removeTeamFromTraining);

// 4. Remove user from team
router.delete("/remove-user-from-team/:user_id/:team_id", syncController.removeUserFromTeam);

module.exports = router;
