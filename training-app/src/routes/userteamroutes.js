const express = require('express');
const router = express.Router();
const userTeamController = require('../controller/userteamController.js')

router.get('/', userTeamController.getAllUserTeams); 
router.post('/', userTeamController.addMemberToTeam);
router.delete("/:team_id/:user_id", userTeamController.deleteMemberFromTeam);

module.exports = router;