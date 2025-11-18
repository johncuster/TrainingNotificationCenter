const db = require("../db/db.js");

const syncController = {
  syncTeamToTraining: (req, res) => {
    console.log("SYNCING TEAM TO TRAINING!!!!");
    const { team_id, training_id } = req.body;

    if (!team_id || !training_id) {
      return res.status(400).json({ error: "Missing team_id or training_id" });
    }

    // Insert into team_training
    const insertTeamTraining = `
      INSERT IGNORE INTO team_training (team_id, training_id)
      VALUES (?, ?)
    `;

    db.query(insertTeamTraining, [team_id, training_id], (err) => {
      if (err) return res.status(500).json({ error: err });

      // Get all users in this team
      const getTeamUsers = `SELECT user_id FROM user_team WHERE team_id = ?`;

      db.query(getTeamUsers, [team_id], (err, users) => {
        if (err) return res.status(500).json({ error: err });

        if (users.length === 0) {
          return res.json({ message: "Team added, but no users found." });
        }

        const now = new Date();
        const mysqlDate = now.toISOString().slice(0, 19).replace("T", " ");

        const insertValues = users.map(u => [
          u.user_id,
          training_id,
          "Pending",
          mysqlDate,
          null,
          team_id,
          null // due_date
        ]);

        const insertUserTraining = `
          INSERT IGNORE INTO user_training
          (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id, due_date)
          VALUES ?
        `;

        db.query(insertUserTraining, [insertValues], (err2) => {
          if (err2) return res.status(500).json({ error: err2 });

          res.json({ message: "Team + all members synced to training." });
          console.log("Team and members are synced to training.");
        });
      });
    });
  },

  // -----------------------------------------------------------------------
  // 2) SYNC WHEN NEW MEMBER JOINS TEAM
  // -----------------------------------------------------------------------
  syncUserToTeamTrainings: (req, res) => {
    const { user_id, team_id } = req.body;

    if (!user_id || !team_id) {
      return res.status(400).json({ error: "Missing user_id or team_id" });
    }

    // Get all trainings assigned to this team
    const getTeamTrainings = `
      SELECT training_id FROM team_training
      WHERE team_id = ?
    `;

    db.query(getTeamTrainings, [team_id], (err, trainings) => {
      if (err) return res.status(500).json({ error: err });

      if (trainings.length === 0) {
        return res.json({ message: "User added to team, but team has no trainings." });
      }

      const now = new Date();
      const mysqlDate = now.toISOString().slice(0, 19).replace("T", " ");

      const insertValues = trainings.map(t => [
        user_id,
        t.training_id,
        "Pending",
        mysqlDate,
        null,
        team_id,
        null
      ]);

      const insertUserTraining = `
        INSERT IGNORE INTO user_training
        (user_id, training_id, ut_status, ut_assigndate, ut_completedate, team_id, due_date)
        VALUES ?
      `;

      db.query(insertUserTraining, [insertValues], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.json({ message: "User synced to all team trainings." });
      });
    });
  },

  // -----------------------------------------------------------------------
  // 3) REMOVE TEAM FROM TRAINING + CLEAN USER_TRAINING
  // -----------------------------------------------------------------------
  removeTeamFromTraining: (req, res) => {
    const { team_id, training_id } = req.params;

    if (!team_id || !training_id) {
      return res.status(400).json({ error: "Missing team_id or training_id" });
    }

    const deleteTeamTraining = `
      DELETE FROM team_training
      WHERE team_id = ? AND training_id = ?
    `;

    db.query(deleteTeamTraining, [team_id, training_id], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Team-training link not found" });
      }

      const deleteUserTraining = `
        DELETE FROM user_training
        WHERE team_id = ? AND training_id = ?
      `;

      db.query(deleteUserTraining, [team_id, training_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.json({ message: "Team removed from training + all user link removed." });
      });
    });
  },

  // -----------------------------------------------------------------------
  // 4) USER REMOVED FROM TEAM → REMOVE TRAININGS ONLY FOR THAT TEAM
  // -----------------------------------------------------------------------
  removeUserFromTeam: (req, res) => {
    const { user_id, team_id } = req.params;

    const deleteUserTeam = `
      DELETE FROM user_team WHERE user_id = ? AND team_id = ?
    `;

    db.query(deleteUserTeam, [user_id, team_id], (err, result) => {
      if (err) return res.status(500).json({ error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User-team link not found" });
      }

      const deleteUserTraining = `
        DELETE FROM user_training
        WHERE user_id = ? AND team_id = ?
      `;

      db.query(deleteUserTraining, [user_id, team_id], (err2) => {
        if (err2) return res.status(500).json({ error: err2 });

        res.json({ message: "User removed from team + user_training entries cleaned." });
      });
    });
  }
};

module.exports = syncController;
