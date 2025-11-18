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

  sql += " GROUP BY t.team_id, t.team_name ORDER BY t.team_name ASC";

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    const progress = results.map(row => {
      const totalUsers = row.total_users;
      const completedUsers = row.completed_users;
      const percentage =
        totalUsers === 0 ? 0 : Math.round((completedUsers / totalUsers) * 100);

      // 📌 Console Logs
      console.log("---- TRAINING PROGRESS ----");
      console.log("Team:", row.team_name);
      console.log("Total Users:", totalUsers);
      console.log("Completed Users:", completedUsers);
      console.log("Completion Percentage:", percentage + "%");
      console.log("----------------------------");

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

};

module.exports = userTrainingController; 