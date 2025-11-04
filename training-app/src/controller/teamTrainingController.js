// controller/teamTrainingController.js
const db = require('../db/db.js');

const teamTrainingController = {

    getAllTeamTraining: (req, res) => {
    const sql = `
      SELECT 
        teamtraining_id, 
        training_id, 
        team_id
      FROM team_training
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching team-training data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(results);
    });
  },

  addTeamToTraining: (req, res) => {
    console.log("ADDTEAMTOTRAINING1");
    const { training_id, team_id } = req.body;

    if (!training_id || !team_id) {
      return res.status(400).json({ error: "Missing training_id or team_id" });
    }
    console.log("ADDTEAMTOTRAINING2");

    const sql = `
      INSERT INTO team_training (training_id, team_id)
      VALUES (?, ?)
    `;
    console.log("ADDTEAMTOTRAINING3");

    db.query(sql, [training_id, team_id], (err, result) => {
      if (err) {
        // prevent duplicate entries (if unique constraint exists)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Team already assigned to this training" });
        }
        console.error("Error adding team to training:", err);
        return res.status(500).json({ error: "Database error" });
      }
      else{
        console.log("ADDTEAMTOTRAINING4");

        res.status(201).json({ message: "Team assigned successfully" });
        console.log("ADDTEAMTOTRAINING5");
      }
      
    });
  },

  deleteTeamFromTraining: (req, res) => {
    const { training_id, team_id } = req.params;
    console.log("DELETE 1");
    if (!training_id || !team_id) {
        return res.status(400).json({ error: "Missing training_id or team_id" });
    }

    const sql = `
        DELETE FROM team_training
        WHERE training_id = ? AND team_id = ?
    `;
    console.log("DELETE 2");
    db.query(sql, [training_id, team_id], (err, result) => {
        if (err) {
        console.error("Error deleting team from training:", err);
        return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Team not found in this training" });
        }

        res.json({ message: "Team removed from training successfully" });
        console.log("DELETE 3");
    });
    },

};

module.exports = teamTrainingController;
