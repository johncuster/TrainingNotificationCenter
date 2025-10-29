const db = require('../db/db.js');

const trainingController = {
  getAllTrainings: (req, res) => {
    const sql = "SELECT * FROM training";
    db.query(sql, (err, data) => {
      if (err) {
        console.error("Error fetching trainings:", err);
        return res.status(500).json({ error: "Database error" });
      }
    res.json(data);  
    });
  },

  createTraining: (req, res) => {
    console.log("Create training");
    const { title, description, due_date, training_link, team} = req.body;

    const sql = `
      INSERT INTO training (title, description, due_date, training_link, team)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    console.log("sql");
        
    db.query(sql, [title, description, due_date, training_link, team], (err, result) => {
          
    console.log("Created Training3");
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
      req.body.title, 
      req.body.description, 
      req.body.due_date, 
      req.body.training_link, 
      req.body.team, 
      req.body.training_status, 
      req.body.progress,        
      req.body.training_id
    ];
      
    console.log("HELLOWORLDUPDATED1");
    
    const sql = `
      UPDATE training
      SET title=?, description=?, due_date=?, training_link=?, team=?, training_status=?, progress=?
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
    
  }
};

module.exports = trainingController; 