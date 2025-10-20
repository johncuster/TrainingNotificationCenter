const express = require('express'); 
const mysql = require('mysql2');   
const cors = require('cors'); 

const app = express();  
app.use(cors());

//connect to MySQL Database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'training_db'
});

app.get('/', (req, res) => {
    return res.json("From backend side");
});

app.get('/user', (req, res) => {
    const sql = "select * from user";
    db.query(sql, (err, data) => { 
        if (err) return res.json(err); 
        return res.json(data); 
    })
});

app.listen(8081, () => {
    console.log("listening");
}); 

module.exports = app;