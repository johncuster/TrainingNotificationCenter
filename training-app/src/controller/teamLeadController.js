const db = require("../db/db.js");

const teamLeadController = {
  //get all teams that a user leads
  getLeadTeamsByUser: (req, res) => {
    const { user_id } = req.params;

    const sql = `
      SELECT t.team_id, t.team_name
      FROM team_lead tl
      JOIN team t ON tl.team_id = t.team_id
      WHERE tl.user_id = ?
    `;

    db.query(sql, [user_id], (err, rows) => {
      if (err) {
        console.error("Error fetching lead teams:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json(rows);
    });
  },

  // update teams that user leads
  updateLeadTeams: (req, res) => {
    const { user_id } = req.params;
    const { lead_teams } = req.body;

    if (!Array.isArray(lead_teams)) {
      return res.status(400).json({ error: "lead_teams must be an array" });
    }

    // Delete all existing lead assignments for this user
    const deleteSql = `DELETE FROM team_lead WHERE user_id = ?`;
    db.query(deleteSql, [user_id], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (lead_teams.length === 0) {
        // No leads → set role to member
        const roleSql = `UPDATE user_member SET user_role = 'member' WHERE user_id = ?`;
        db.query(roleSql, [user_id], (err) => {
          if (err) return res.status(500).json({ error: "Database error" });
          return res.json({ message: "User is no longer a lead" });
        });
      } else {
        // Insert new lead teams
        const insertSql = `INSERT INTO team_lead (team_id, user_id) VALUES ?`;
        const values = lead_teams.map((teamId) => [teamId, user_id]);

        db.query(insertSql, [values], (err) => {
          if (err) return res.status(500).json({ error: "Database error" });

          // Ensure role is 'lead'
          const roleSql = `UPDATE user_member SET user_role = 'lead' WHERE user_id = ?`;
          db.query(roleSql, [user_id], (err) => {
            if (err) return res.status(500).json({ error: "Database error" });
            res.json({ message: "Lead teams updated" });
          });
        });
      }
    });
  },

  getTeamsForUser: (req, res) => {
    const { user_id } = req.params;
    const sql = `
      SELECT t.team_id, t.team_name
      FROM user_team ut
      JOIN team t ON ut.team_id = t.team_id
      WHERE ut.user_id = ?
    `;
    db.query(sql, [user_id], (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    });
  },
};

module.exports = teamLeadController;
