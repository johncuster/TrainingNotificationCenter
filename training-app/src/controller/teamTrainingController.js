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

  const sqlTeamTraining = `
    INSERT INTO team_training (training_id, team_id)
    VALUES (?, ?)
  `;

  console.log("ADDTEAMTOTRAINING3");

  db.query(sqlTeamTraining, [training_id, team_id], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        console.log("Team already assigned to this training (team_training)");
      } else {
        console.error("Error adding team to training:", err);
        return res.status(500).json({ error: "Database error" });
      }
    }
    console.log("ADDTEAMTOTRAINING4");

    // 1️⃣ Get all users in the team
    const sqlGetUsers = `SELECT user_id FROM user_team WHERE team_id = ?`;
    db.query(sqlGetUsers, [team_id], (err, users) => {
      if (err) {
        console.error("Error fetching users in team:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (users.length === 0) {
        console.log("ADDTEAMTOTRAINING5: No users in team");
        return res.status(201).json({ message: "Team assigned, but no users found" });
      }

      // 2️⃣ Get existing user_training for this training & team
      const userIds = users.map(u => u.user_id);
      const placeholders = userIds.map(() => '?').join(',');
      const sqlCheckExisting = `
        SELECT user_id FROM user_training 
        WHERE training_id = ? AND team_id = ? AND user_id IN (${placeholders})
      `;

      db.query(sqlCheckExisting, [training_id, team_id, ...userIds], (err, existingRows) => {
        if (err) {
          console.error("Error checking existing user_training:", err);
          return res.status(500).json({ error: "Database error" });
        }

        const existingUserIds = existingRows.map(r => r.user_id);

        // 3️⃣ Filter users who don't already have the training
        const newUsers = users.filter(u => !existingUserIds.includes(u.user_id));

        if (newUsers.length === 0) {
          console.log("ADDTEAMTOTRAINING5: All users already assigned");
          return res.status(201).json({ message: "Training already assigned to all users" });
        }

        // 4️⃣ Insert only for new users
        const now = new Date();
        const mysqlDate = now.toISOString().slice(0, 19).replace("T", " ");

        const insertValues = newUsers.map(u => [
          u.user_id,
          training_id,
          'Pending', // default ut_status
          mysqlDate,
          null,
          team_id
        ]);

        const sqlInsertUserTraining = `
          INSERT INTO user_training (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id)
          VALUES ?
        `;

        db.query(sqlInsertUserTraining, [insertValues], (err2, result2) => {
          if (err2) {
            console.error("Error assigning training to users:", err2);
            return res.status(500).json({ error: "Database error" });
          }

          console.log("ADDTEAMTOTRAINING5: Training assigned to new users successfully");
          res.status(201).json({ message: "Team and all users assigned successfully" });
        });
      });
    });
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
