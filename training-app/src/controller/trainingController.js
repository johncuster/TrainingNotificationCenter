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
      const id = req.params.id;
      const { title, description, due_date, training_link, team, training_status, progress } = req.body;
      console.log("HELLOWORLDUPDATED");
      const sql = `
        UPDATE training
        SET title=?, description=?, due_date=?, training_link=?, team=?, training_status=?, progress=?
        WHERE training_id=?`;

      db.query(sql, [title, description, due_date, training_link, team, training_status, progress, id], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ training_id: id, title, description, due_date, training_link, team, training_status, progress });
      })
  },
};

module.exports = trainingController; 