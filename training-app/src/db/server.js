const express = require('express');  
const cors = require('cors'); 
const db = require('../db/db.js');
const trainingRoutes = require('../routes/trainingroutes.js')
const teamRoutes = require('../routes/teamroutes.js')
const teamTrainingRoutes = require('../routes/teamtrainingroutes.js');
const memberRoutes = require('../routes/memberroutes.js');

const app = express();  
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    return res.json("From backend side");
});

app.use('/training', trainingRoutes);
app.use('/team', teamRoutes);
app.use('/team_training', teamTrainingRoutes);
app.use('/member', memberRoutes);

app.listen(8081, () => {
    console.log("listening");
}); 

module.exports = app;