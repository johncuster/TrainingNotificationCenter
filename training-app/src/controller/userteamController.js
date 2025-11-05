const db = require('../db/db.js');
const memberQueries = require('../db/memberQueries.js');

const userteamController = {
  getAllUserTeams: (req, res) => {
    const sql = `select * from user_team`;

    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching trainings:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(data);  
    });
  },
  
  addMemberToTeam: (req, res) => {
    console.log("addMemberToTeam1");
    const { team_id, user_id } = req.body;

    if (!user_id || !team_id) {
      return res.status(400).json({ error: "Missing user_id or team_id" });
    }
    console.log("addMemberToTeam2");

    const sql = `
      INSERT INTO user_team (team_id, user_id)
      VALUES (?, ?)
    `;
    console.log("addMemberToTeam3");

    db.query(sql, [team_id, user_id], (err, result) => {
      if (err) {
        // prevent duplicate entries (if unique constraint exists)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Team already assigned to this training" });
        }
        console.error("Error adding team to training:", err);
        return res.status(500).json({ error: "Database error" });
      }
      else{
        res.status(201).json({ message: "Member assigned successfully" });
        console.log("addMemberToTeam4");
      }
      
    });
  },

  deleteMemberFromTeam: (req, res) => {
    const { team_id, user_id } = req.params;
    console.log("DELETE 1");

    if (!user_id || !team_id) {
        return res.status(400).json({ error: "Missing training_id or team_id" });
    }

    const sql = `
        DELETE FROM user_team
        WHERE user_id = ? AND team_id = ?
    `;
    console.log("DELETE 2");

    db.query(sql, [user_id, team_id], (err, result) => {
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

module.exports = userteamController; 