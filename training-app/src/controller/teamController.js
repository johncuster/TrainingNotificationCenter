const db = require('../db/db.js');

const teamController = {
  getAllTeams: (req, res) => {
    const sql = "SELECT * FROM team";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching teams:", err);
        return res.status(500).json({ error: "Database error" });
      }
    res.json(data);  
    });
  },

  createTeam: (req, res) => {
    console.log("Create team");
    const { team_name} = req.body;

    const sql = `
      INSERT INTO team (team_name)
      VALUES (?)
    `;
    
    console.log("sql");
        
    db.query(sql, [team_name], (err, result) => {
          
    console.log("Created Team2");
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); // show what failed
        return res.status(500).json({ error: err });
      }
          
      console.log("Created Team3");
      res.json({ team_id: result.insertId, ...req.body });
          
    });
  },

  updateTeam: (req, res) => {
    const values =
    [
      req.body.team_name,
      req.body.team_id
    ];
      
    console.log("TEAMUPDATED1");
    
    const sql = `
      UPDATE team
      SET team_name = ?
      WHERE team_id=?`;
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); 
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Team updated successfully" });
      console.log("TEAMUPDATED3");      
    })
  },

  deleteTeam: (req, res) => {
    const values = [req.params.team_id];
    console.log(values);
    console.log("DELETE TEAM1");
    const sql = `DELETE FROM team WHERE team_id = ?`;
    db.query(sql, values, (err, result) => {
      console.log(sql);
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); 
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Team deleted" });
      console.log("DELETE TRAINING2");
    });
    
  },

  getTeamMembers: (req, res) => {
    const teamId = req.params.team_id;
    console.log("TEAM MEMBERS !");
    const sql = `
    SELECT u.user_id, u.user_ln, u.user_fn, u.user_role, u.user_email
    FROM user_member u
    JOIN user_team ut ON u.user_id = ut.user_id
    WHERE ut.team_id = ?
    ORDER BY u.user_id ASC;
  `;

  db.query(sql, [teamId], (err, results) => {
    if (err) {
      console.error("Error fetching members for team:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Team members fetched successfully");
    res.json(results);
  });
  }
};

module.exports = teamController; 