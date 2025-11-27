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

      // 1️⃣ Get all users in the team
      const sqlUsers = `SELECT user_id FROM user_team WHERE team_id = ?`;
      db.query(sqlUsers, [team_id], (err, users) => {
        if (err) {
          console.error("Error fetching users:", err);
          return checkDone();
        }

        if (users.length === 0) {
          return checkDone(); // no users → nothing to sync
        }

        const userIds = users.map(u => u.user_id);

        // 2️⃣ Get user_training entries for this training and team
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

          // 3️⃣ Insert missing user_training rows
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
            checkDone(); // continue regardless
          });
        });
      });
    });
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

  // 1️⃣ Update team_training
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

    // 2️⃣ Update user_training for all users in the team
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
