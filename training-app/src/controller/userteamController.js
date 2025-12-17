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
    const { team_id, user_id } = req.body;
    if (!team_id || !user_id) {
      return res.status(400).json({ error: "Missing team_id or user_id" });
    }

    db.beginTransaction(err => {
      if (err) return res.status(500).json({ error: "Database transaction error" });

      const sqlInsertUserTeam = `INSERT INTO user_team (team_id, user_id) VALUES (?, ?)`;
      db.query(sqlInsertUserTeam, [team_id, user_id], (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return db.rollback(() => res.status(409).json({ error: "User already in this team" }));
          }
          return db.rollback(() => res.status(500).json({ error: "Database error adding user to team" }));
        }

        const sqlTeamTrainings = `SELECT training_id FROM team_training WHERE team_id = ?`;
        db.query(sqlTeamTrainings, [team_id], (err, trainings) => {
          if (err) return db.rollback(() => res.status(500).json({ error: "Database error fetching team trainings" }));

          if (trainings.length === 0) {
            return db.commit(err => {
              if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
              res.status(201).json({ message: "Member added to team. No trainings assigned yet." });
            });
          }

          const trainingIds = trainings.map(t => t.training_id);
          const placeholders = trainingIds.map(() => '?').join(',');
          const sqlCheckExisting = `
            SELECT training_id FROM user_training
            WHERE user_id = ? AND training_id IN (${placeholders}) AND team_id = ?
          `;
          db.query(sqlCheckExisting, [user_id, ...trainingIds, team_id], (err, existing) => {
            if (err) return db.rollback(() => res.status(500).json({ error: "DB error checking existing trainings" }));

            const existingIds = existing.map(r => r.training_id);
            const newTrainings = trainingIds.filter(id => !existingIds.includes(id));

            if (newTrainings.length === 0) {
              return db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                res.status(201).json({ message: "Member added. Already assigned to all trainings" });
              });
            }

            const now = new Date();
            const mysqlDate = now.toISOString().slice(0, 19).replace("T", " ");
            const insertValues = newTrainings.map(tid => [user_id, tid, 'Pending', mysqlDate, null, team_id]);

            const sqlInsertUserTraining = `
              INSERT INTO user_training (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id)
              VALUES ?
            `;
            db.query(sqlInsertUserTraining, [insertValues], (err2) => {
              if (err2) return db.rollback(() => res.status(500).json({ error: "Error assigning trainings to user" }));

              db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ error: "Commit failed" }));
                res.status(201).json({ message: "Member added and all team trainings assigned successfully" });
              });
            });
          });
        });
      });
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