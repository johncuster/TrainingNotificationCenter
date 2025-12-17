// controller/teamTrainingController.js
const db = require('../db/db.js');

const teamTrainingController = {

  getAllTeamTraining: (req, res) => {
  const sqlTeamTraining = `
    SELECT teamtraining_id, training_id, team_id
    FROM team_training
  `;

  db.query(sqlTeamTraining, (err, teamTrainings) => {
    if (err) {
      console.error("Error fetching team-training data:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (teamTrainings.length === 0) {
      return res.json([]);
    }

    let processed = 0; // counter to track completed syncs

    // Function to check if all items have been processed
    const checkDone = () => {
      processed++;
      if (processed === teamTrainings.length) {
        return res.json(teamTrainings);
      }
    };

    teamTrainings.forEach(tt => {
      const { training_id, team_id } = tt;

      const sqlUsers = `SELECT user_id FROM user_team WHERE team_id = ?`;
      db.query(sqlUsers, [team_id], (err, users) => {
        if (err) {
          console.error("Error fetching users:", err);
          return checkDone();
        }

        if (users.length === 0) {
          return checkDone(); 
        }

        const userIds = users.map(u => u.user_id);

        const placeholders = userIds.map(() => '?').join(',');
        const sqlUserTraining = `
          SELECT user_id FROM user_training
          WHERE training_id = ? AND team_id = ? AND user_id IN (${placeholders})
        `;

        db.query(sqlUserTraining, [training_id, team_id, ...userIds], (err, existingRows) => {
          if (err) {
            console.error("Error fetching user_training:", err);
            return checkDone();
          }

          const existingIds = existingRows.map(r => r.user_id);
          const missingUsers = userIds.filter(uid => !existingIds.includes(uid));

          if (missingUsers.length === 0) {
            return checkDone(); // all users already have training
          }

          const now = new Date().toISOString().slice(0, 19).replace("T", " ");
          const insertValues = missingUsers.map(uid => [
            uid,
            training_id,
            'Pending',
            now,
            null,
            team_id
          ]);

          const sqlInsert = `
            INSERT INTO user_training 
            (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id)
            VALUES ?
          `;

          db.query(sqlInsert, [insertValues], (err2) => {
            if (err2) {
              console.error("Error inserting missing user_training:", err2);
            }
            checkDone();
          });
        });
      });
    });
  });
},


addTeamToTraining: (req, res) => {
  console.log("ADDTEAMTOTRAINING START");

  const { training_id, team_id, due_date } = req.body;

  if (!training_id || !team_id || !due_date) {
    return res.status(400).json({ error: "Missing training_id, team_id, or due_date" });
  }

  const sqlInsertTeamTraining = `
    INSERT INTO team_training (training_id, team_id, due_date)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE due_date = VALUES(due_date)
  `;

  db.query(sqlInsertTeamTraining, [training_id, team_id, due_date], (err, result) => {
    if (err) {
      console.error("Error inserting team_training:", err);
      return res.status(500).json({ error: "Database error inserting team_training" });
    }

    console.log("team_training inserted/updated");

    // Get all users in that team
    const sqlGetUsers = `SELECT user_id FROM user_team WHERE team_id = ?`;

    db.query(sqlGetUsers, [team_id], (err, users) => {
      if (err) {
        console.error("Error fetching team users:", err);
        return res.status(500).json({ error: "Database error fetching team users" });
      }

      if (users.length === 0) {
        return res.status(201).json({ message: "Team assigned, but no users in this team" });
      }

      const userIds = users.map(u => u.user_id);
      const placeholders = userIds.map(() => '?').join(',');

      // Check existing user_training entries
      const sqlCheckExisting = `
        SELECT user_id FROM user_training
        WHERE training_id = ? AND team_id = ? AND user_id IN (${placeholders})
      `;

      db.query(sqlCheckExisting, [training_id, team_id, ...userIds], (err, existingRows) => {
        if (err) {
          console.error("Error checking existing user_training:", err);
          return res.status(500).json({ error: "Database error checking user_training" });
        }

        const existingUserIds = existingRows.map(r => r.user_id);

        const newUsers = userIds.filter(uid => !existingUserIds.includes(uid));

        const now = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Insert missing user_training rows
        if (newUsers.length > 0) {
          const insertValues = newUsers.map(uid => [
            uid,
            training_id,
            'Pending',   
            now,         // ut_assigndate
            null,        // ut_completedate
            team_id,
            due_date     // assign same due_date to users
          ]);

          const sqlInsertUserTraining = `
            INSERT INTO user_training
            (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id, due_date)
            VALUES ?
          `;

          db.query(sqlInsertUserTraining, [insertValues], (err2) => {
            if (err2) {
              console.error("Error inserting into user_training:", err2);
              return res.status(500).json({ error: "Database error inserting user_training" });
            }

            console.log("Inserted new user_training rows");
          });
        }

        // Update due_date for all existing user_training rows
        const sqlUpdateExisting = `
          UPDATE user_training
          SET due_date = ?
          WHERE training_id = ? AND team_id = ?
        `;

        db.query(sqlUpdateExisting, [due_date, training_id, team_id], (err3) => {
          if (err3) {
            console.error("Error updating user_training due dates:", err3);
            return res.status(500).json({ error: "Database error updating due_date for users" });
          }

          console.log("Updated due_date for existing user_training rows");

          return res.status(201).json({
            message: "Team assigned and all user_training due_dates updated successfully"
          });
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
getLeadTeamTraining: (req, res) => {
  const leadId = req.params.user_id;

  const sql = `
      SELECT 
      u.user_id,
      u.user_fn,
      u.user_ln,
      ut.usertraining_id,
      ut.ut_status,
      DATE_FORMAT(ut.ut_assigndate, '%Y-%m-%d') AS ut_assigndate,
      DATE_FORMAT(ut.ut_completedate, '%Y-%m-%d') AS ut_completedate,
      tr.training_title,
      tr.training_desc,
      tr.training_link,
      DATE_FORMAT(ut.due_date, '%Y-%m-%d') AS due_date,
      t.team_id,
      t.team_name
    FROM team_lead tl
    JOIN team t ON t.team_id = tl.team_id
    JOIN user_team utm ON utm.team_id = t.team_id
    JOIN user_member u ON u.user_id = utm.user_id
    LEFT JOIN user_training ut 
        ON ut.user_id = u.user_id AND ut.team_id = t.team_id
    LEFT JOIN training tr 
        ON tr.training_id = ut.training_id
    WHERE tl.user_id = ?;
    `;

    db.query(sql, [leadId], (err, results) => {
        if (err) {
            console.error("Error fetching member training progress:", err);
            return res.status(500).json({ error: "Server error" });
        }
        res.json(results);
    });
},
getAllTeamLeads: (req, res) => {
    const sql = `
        SELECT * FROM team_lead tl
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching team leads:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
},

getLeadTeams: (req, res) => {
    const leadId = req.params.leadId;

    const sql = `
        SELECT 
            t.team_id,
            t.team_name
        FROM team_lead tl
        JOIN team t ON t.team_id = tl.team_id
        WHERE tl.user_id = ?
        ORDER BY t.team_name;
    `;

    db.query(sql, [leadId], (err, results) => {
        if (err) {
            console.error("Error fetching teams led by lead:", err);
            return res.status(500).json({ error: "Server error" });
        }
        res.json(results);
    });
},

updateTeamTrainingDueDate: (req, res) => {
  const { training_id, team_id } = req.params;
  const { due_date } = req.body;

  if (!training_id || !team_id || !due_date) {
    return res.status(400).json({ error: "Missing training_id, team_id, or due_date" });
  }

  const sqlUpdateTeamTraining = `
    UPDATE team_training
    SET due_date = ?
    WHERE training_id = ? AND team_id = ?
  `;

  db.query(sqlUpdateTeamTraining, [due_date, training_id, team_id], (err, result) => {
    if (err) {
      console.error("Error updating team_training due_date:", err);
      return res.status(500).json({ error: "Failed to update team_training" });
    }

    const sqlUpdateUserTraining = `
      UPDATE user_training
      SET due_date = ?
      WHERE training_id = ? AND team_id = ?
    `;

    db.query(sqlUpdateUserTraining, [due_date, training_id, team_id], (err2, result2) => {
      if (err2) {
        console.error("Error updating user_training due_date:", err2);
        return res.status(500).json({ error: "Failed to update user_training" });
      }

      res.json({ message: "Due date updated for team and all users successfully" });
    });
  });
},


};

module.exports = teamTrainingController;
