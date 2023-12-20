const express = require('express');
const app = express();
const mysql = require('mysql');
require('dotenv').config(); // Load environment variables from .env file
app.use(express.json()); // Enable JSON request and response handling

const port = process.env.PORT || 8000; // Use the PORT environment variable or fallback to 8000

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

app.post('/add', (req, res) => {
    const { name, age } = req.body;
    const query = `INSERT INTO users (name, age) VALUES (?, ?)`;
    const values = [name, age];

    connection.query(query,values,(err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).send('secucces');
    });
});

app.get('/get', (req, res) => {
    // Define your SQL query
    const query = 'SELECT * FROM users';

    // Execute the SQL query
    connection.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error retrieving data');
        } else {
            console.log('Data retrieved successfully');
            res.status(200).send(results); // Send the retrieved data as JSON
        }
    });
});


app.put('/put/:id', (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;

    // Construct the SQL query using template literals
    const query = `UPDATE users SET name = '${name}', age = ${age} WHERE id = ${id}`;

    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating data');
        } else {
            console.log('Data updated successfully');
            res.status(200).json(result); // Send the updated data as JSON
        }
    });
});

//delet

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;

    // Construct the SQL query using template literals
    const query = `DELETE FROM users WHERE id = ${id}`;

    connection.query(query, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error deleting data');
        } else {
            console.log('Data deleted successfully');
            res.status(200).json(result); // Send the result as JSON (typically, it will be an object indicating the number of affected rows)
        }
    });
});





app.listen(port, () => console.log('Server is running at', port));



