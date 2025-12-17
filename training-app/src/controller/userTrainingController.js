const db = require('../db/db.js');
const memberQueries = require('../db/memberQueries.js');

const userTrainingController = {
  getAllUserTrainings: (req, res) => {
    const sql = `select * from user_training`;

    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching trainings:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(data);  
    });
  },
  updateTraining: (req, res) => {
    const { ut_status, usertraining_id } = req.body;
    console.log("UPDATINGTRAININGSTATUS1");
    if ( !usertraining_id || !ut_status) {
      return res.status(400).json({ error: "Missing user_id, training_id, or ut_status" });
    }

    const sql = `
      UPDATE user_training
      SET 
        ut_status = ?,
        ut_completedate = CASE WHEN ? = 'Completed' THEN NOW() ELSE NULL END
      WHERE usertraining_id = ?
    `;

    db.query(sql, [ut_status, ut_status, usertraining_id], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: "Database error" });
        
      }
      res.json({ message: "Training updated successfully" });
      console.log("UPDATINGTRAININGSTATUS2");
    });
  },
  getTrainingProgress: (req, res) => {
    const { training_id, team_id } = req.params;

    if (!training_id) {
      return res.status(400).json({ error: "Missing training_id" });
    }

    let sql = `
      SELECT 
        t.team_id,
        t.team_name,
        DATE_FORMAT(ut.due_date, '%Y-%m-%d') AS due_date,

        COUNT(ut.user_id) AS total_users,
        SUM(CASE WHEN ut.ut_status = 'Completed' THEN 1 ELSE 0 END) AS completed_users
      FROM user_training ut
      JOIN user_team utm 
        ON ut.user_id = utm.user_id 
        AND ut.team_id = utm.team_id   -- important: match team_id in both tables
        AND ut.training_id = ?         -- only this training
      JOIN team t 
        ON utm.team_id = t.team_id
    `;
    const params = [training_id];

    if (team_id) {
      sql += " WHERE t.team_id = ?";
      params.push(team_id);
    }

    sql += " GROUP BY t.team_id, t.team_name, ut.due_date ORDER BY t.team_name ASC";

    db.query(sql, params, (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const progress = results.map(row => {
        const totalUsers = row.total_users;
        const completedUsers = row.completed_users;
        const percentage =
          totalUsers === 0 ? 0 : Math.round((completedUsers / totalUsers) * 100);

        console.log("Training Progress:");
        console.log("Team:", row.team_name);
        console.log("Total Users:", totalUsers);
        console.log("Due Date:", row.due_date);
        console.log("Completed Users:", completedUsers);
        console.log("Completion Percentage:", percentage + "%");

        return {
          team_id: row.team_id,
          team_name: row.team_name,
          total_users: totalUsers,
          completed_users: completedUsers,
          completion_percentage: percentage
        };
      });

      res.json(progress);
    });
  },

  updateDueDate: (req, res) => {
    const { training_id, team_id } = req.params;
    const { due_date } = req.body;

    if (!training_id || !team_id || !due_date) {
      return res.status(400).json({ error: "Missing training_id, team_id, or due_date" });
    }

    const sql = `
      UPDATE user_training
      SET due_date = ?
      WHERE training_id = ? AND team_id = ?
    `;

    db.query(sql, [due_date, training_id, team_id], (err, result) => {
      if (err) {
        console.error("Error updating user_training due_date:", err);
        return res.status(500).json({ error: "Failed to update user_training due_date" });
      }

      res.json({ message: "User training due_date updated successfully" });
    });
  },
  getKpi: (req, res) => {
    const { userId } = req.params;
    const { team } = req.query; // ?team=XYZ (optional)

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Base SQL
    let sql = `
      SELECT 
        ut_status,
        due_date,
        team_name
      FROM user_training
      WHERE user_id = ?
    `;
    
    const params = [userId];

    // Optional filter by team
    if (team && team !== "ALL") {
      sql += " AND team_name = ?";
      params.push(team);
    }

    db.query(sql, params, (err, rows) => {
      if (err) {
        console.error("Error fetching KPI:", err);
        return res.status(500).json({ error: "Database error" });
      }

      const total = rows.length;
      const completed = rows.filter(r => r.ut_status === "Completed").length;
      const pending = rows.filter(r => r.ut_status === "Pending").length;

      const today = new Date();
      const overdue = rows.filter(r => {
        if (!r.due_date) return false;
        return new Date(r.due_date) < today && r.ut_status !== "Completed";
      }).length;

      res.json({
        total,
        completed,
        pending,
        overdue
      });
    });
  },

  getUserTrainingsWithTeams: (req, res) => {
  const { user_id } = req.params;
  console.log("Fetching trainings");

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id" });
  }

  const sql = `
    SELECT 
      ut.training_id,
      tr.training_name,
      ut.team_id,
      t.team_name,
      ut.ut_status,
      DATE_FORMAT(ut.due_date, '%Y-%m-%d') AS due_date
    FROM user_training ut
    JOIN training tr ON ut.training_id = tr.training_id
    JOIN team t ON ut.team_id = t.team_id
    WHERE ut.user_id = ?
    ORDER BY tr.training_name ASC
  `;
  console.log("Fetching trainings for user_id:", user_id);
  db.query(sql, [user_id], (err, rows) => {
    if (err) {
      console.error("Error fetching user trainings:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(rows);
  });
},


};

module.exports = userTrainingController; 