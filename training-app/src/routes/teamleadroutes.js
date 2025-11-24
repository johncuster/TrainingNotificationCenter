const express = require("express");
const router = express.Router();
const teamLeadController = require("../controller/teamLeadController");

router.get("/:user_id", teamLeadController.getLeadTeamsByUser);
router.put("/update/:user_id", teamLeadController.updateLeadTeams);

module.exports = router;
