const db = require('../db/db.js');
const memberQueries = require('../db/memberQueries.js');
const bcrypt = require("bcrypt");

const memberController = {
  getAllMembers: (req, res) => {
    db.query(memberQueries.selectMembers, (err, data) => {
      if (err) {
        console.error("Error fetching trainings:", err);
        return res.status(500).json({ error: "Database error" });
      }
    res.json(data);  
    });
  },

  createMember: async (req, res) => {
  console.log("Create member request received");

  const defaultPassword = '@Analytics123';
  const { user_ln, user_fn, user_role, user_email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const insertQuery = `
      INSERT INTO user_member 
      (user_ln, user_fn, user_role, user_email, user_password)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertQuery,
      [user_ln, user_fn, user_role, user_email, hashedPassword],
      (err, result) => {
        console.log("SQL Insert:", user_ln, user_fn, user_role, user_email);

        if (err) {
          console.error("DB Error:", err.sqlMessage || err);
          return res.status(500).json({ error: err.sqlMessage || err });
        }

        console.log("Member created successfully");
        res.json({ 
          user_id: result.insertId,
          user_ln,
          user_fn,
          user_role,
          user_email
        });
      }
    );
  } catch (hashErr) {
    console.error("Password hashing error:", hashErr);
    res.status(500).json({ error: "Failed to hash password" });
  }
},

    updateMember: (req, res) => {
      const values =
      [
        req.body.user_ln, 
        req.body.user_fn, 
        req.body.user_role,        
        req.body.user_email,
        req.body.user_id
      ];
        
      console.log("HELLOWORLDUPDATED1");
    
      db.query(memberQueries.updateMember, values, (err, result) => {
        if (err) {
          console.error("DB Error:", err.sqlMessage || err); 
          return res.status(500).json({ error: err });
        }
        res.json({ message: "Member updated successfully" });
        console.log("HELLOWORLDUPDATED3");      
      })
  },

  deleteMember: (req, res) => {
  const userId = req.params.user_id;
  console.log("Deleting user with ID:", userId);

  const queries = [
  "DELETE FROM team_lead WHERE user_id = ?",
  "DELETE FROM user_training WHERE user_id = ?",
  "DELETE FROM user_team WHERE user_id = ?",
  "DELETE FROM user_member WHERE user_id = ?"
];

  const runQuery = (index) => {
    if (index >= queries.length) {
      console.log("All deletions complete");
      return res.json({ message: "Member and related data deleted" });
    }

    db.query(queries[index], [userId], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ error: err });
      }
      console.log(`Deleted from table ${index + 1}`);
      runQuery(index + 1);
    });
  };

  runQuery(0);
},


getTrainingTeams: (req, res) => {
    const trainingId = req.params.training_id;

    const sql = `
      SELECT tt.team_id, t.team_name
      FROM team_training tt
      JOIN team t ON tt.team_id = t.team_id
      WHERE tt.training_id = ?
      ORDER BY tt.team_id ASC;
    `;

    db.query(sql, [trainingId], (err, results) => {
      if (err) {
        console.error("Error fetching teams for training:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log("YAY WORKING");
      res.json(results);
    });
  },
  getUser: (req, res) => {
    const userId = req.params.user_id;
    const sql = `
    SELECT 
      ut.usertraining_id,
      u.user_ln,
      u.user_fn,
      t.team_name AS team_name,
      tr.training_title,
      tr.training_desc,
      tr.training_link,
      ut.ut_status,
      DATE_FORMAT(ut.ut_assigndate, '%Y-%m-%d') AS ut_assigndate,
      DATE_FORMAT(ut.ut_completedate, '%Y-%m-%d') AS ut_completedate,
      DATE_FORMAT(ut.due_date, '%Y-%m-%d') AS due_date
    FROM user_team utm
    JOIN team t ON t.team_id = utm.team_id
    LEFT JOIN user_training ut ON ut.user_id = utm.user_id AND ut.team_id = t.team_id
    LEFT JOIN training tr ON tr.training_id = ut.training_id
    LEFT JOIN user_member u ON utm.user_id = u.user_id
    WHERE utm.user_id = ?

    `;
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.error("Error fetching member dashboard data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      console.log("SQL RESULT:", result);
      res.json(result);
    });
  },

changePassword: async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  if (!user_id || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const sql = `SELECT user_password FROM user_member WHERE user_id = ?`;
    db.query(sql, [user_id], async (err, result) => {
      if (err) return res.status(500).json({ error: "Database error" });
      if (result.length === 0) return res.status(404).json({ error: "User not found" });

      const hashedPassword = result[0].user_password;

      if (hashedPassword && currentPassword) {
        const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
        if (!isMatch) {
          return res.status(401).json({ error: "Current password is incorrect" });
        }
      }

      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = `UPDATE user_member SET user_password = ? WHERE user_id = ?`;

      db.query(updateSql, [newHashedPassword, user_id], (updateErr) => {
        if (updateErr) return res.status(500).json({ error: "Failed to update password" });
        res.json({ message: "Password updated successfully" });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

};

module.exports = memberController; 