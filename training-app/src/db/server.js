const express = require('express');  
const cors = require('cors'); 
const db = require('../db/db.js');
const trainingRoutes = require('../routes/trainingroutes.js')
const teamRoutes = require('../routes/teamroutes.js')

const app = express();  
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.json("From backend side");
});

// app.get('/user', (req, res) => {
//     const sql = "select * from user";
//     db.query(sql, (err, data) => { 
//         if (err) return res.json(err); 
//         return res.json(data); 
//     })
// });

app.use('/training', trainingRoutes);
app.use('/team', teamRoutes);

app.listen(8081, () => {
    console.log("listening");
}); 

module.exports = app;