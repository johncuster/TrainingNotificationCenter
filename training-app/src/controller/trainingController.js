const db = require('../db/db.js');
const trainingQueries = require('../db/trainingQueries.js');

const trainingController = {
  getAllTrainings: (req, res) => {
    db.query(trainingQueries.selectTraining, (err, data) => {
      if (err) {
        console.error("Error fetching trainings:", err);
        return res.status(500).json({ error: "Database error" });
      }
    res.json(data);  
    });
  },

  createTraining: (req, res) => {
    console.log("Create training");
    const {training_title, training_desc, training_link} = req.body;
    db.query(trainingQueries.createTraining, [training_title, training_desc, training_link], (err, result) => {
      console.log("SQL :", training_title, training_desc, training_link);
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); // show what failed
        return res.status(500).json({ error: err });
      }
      console.log("Created Training4");
      res.json({ training_id: result.insertId, ...req.body });
    });
  },

  updateTraining: (req, res) => {
    console.log(req.body.due_date);
    const formatdate = req.body.due_date ? new Date(req.body.due_date).toISOString().slice(0, 10): null;
    console.log(req.body.due_date);
    req.body.due_date = formatdate;
    
    const values =
    [
      req.body.training_title, 
      req.body.training_desc, 
      req.body.training_link,        
      req.body.training_id
    ];
      
    console.log("HELLOWORLDUPDATED1");
    
    const sql = `
      UPDATE training
      SET training_title=?, training_desc=?, training_link=?
      WHERE training_id=?`;
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); 
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Training updated successfully" });
      console.log("HELLOWORLDUPDATED3");      
    })
  },

  deleteTraining: (req, res) => {
    const values = [req.params.training_id];
    console.log(values);
    console.log("DELETE TRAINING1");
    const sql = `DELETE FROM training WHERE training_id = ?`;
    db.query(sql, values, (err, result) => {
      console.log(sql);
      if (err) {
        console.error("DB Error:", err.sqlMessage || err); 
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Training deleted" });
      console.log("DELETE TRAINING2");
    });
  },
  
getTrainingTeams: (req, res) => {
    const trainingId = req.params.training_id;

    const sql = `
      SELECT tt.team_id, t.team_name, DATE_FORMAT(tt.due_date, '%Y-%m-%d') AS due_date
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
 getTrainingMembers: (req, res) => {
  const trainingId = req.params.training_id;

  const sql = `
   SELECT
    t.team_id,
    t.team_name,
    m.user_id,
    m.user_ln,
    m.user_fn,
    CASE 
        WHEN ut.ut_status IS NULL THEN 'Pending'
        ELSE ut.ut_status
    END AS ut_status
FROM team_training tt
JOIN team t ON tt.team_id = t.team_id
JOIN user_team ut_team ON ut_team.team_id = t.team_id
JOIN user_member m ON m.user_id = ut_team.user_id
LEFT JOIN user_training ut 
    ON ut.user_id = m.user_id 
    AND ut.training_id = tt.training_id
    AND ut.team_id = t.team_id  -- ✅ Important: match team-specific training
WHERE tt.training_id = ?
ORDER BY t.team_id ASC, m.user_id ASC;
  `;

  db.query(sql, [trainingId], (err, results) => {
    if (err) {
      console.error("Error fetching training members:", err);
      return res.status(500).json({ error: "Database error" });
    }
    // Convert 1/0 or other ut_status values to boolean
    const formattedResults = results.map(r => ({
  ...r,
  ut_status: r.ut_status || "Pending"  // default to "Pending" if null
}));

    res.json(formattedResults);
  });
}



};

module.exports = trainingController; 