const db = require('../db/db.js');
const memberQueries = require('../db/memberQueries.js');

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

  createMember: (req, res) => {
    console.log("Create member");
    const password = '@Analytics123';
    const {user_ln, user_fn, user_role, user_email} = req.body;
    db.query(memberQueries.createMember, [user_ln, user_fn, user_role, user_email, password], (err, result) => {
      console.log("SQL :", user_ln, user_fn, user_role, user_email);
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); // show what failed
        return res.status(500).json({ error: err });
      }
      console.log("Created Member4");
      res.json({ user_id: result.insertId, ...req.body });
    });
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
    const values = [req.params.user_id];
    console.log(values);
    console.log("DELETE TRAINING1");
    const sql = `DELETE FROM user_member WHERE user_id = ?`;
    db.query(sql, values, (err, result) => {
      console.log(sql);
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); 
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Member deleted" });
      console.log("DELETE TRAINING2");
    });
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
};

module.exports = memberController; 