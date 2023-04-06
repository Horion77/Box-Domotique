const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const morgan = require('morgan');
const SerialPort = require('serialport');


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'alan',
  password: 'luka77',
  database: 'box_domo'
});

const serialport = new SerialPort('COM5', {
  baudRate: 9600,
});



  function sendLedStateToArduino(state) {
    if (state === 1) {
      if (serialport) {
        serialport.write('ON\n');
      } else {
        console.log("SerialPort not defined, cannot send 'ON' command");
      }
    } else {
      if (serialport) {
        serialport.write('OFF\n');
      } else {
        console.log("SerialPort not defined, cannot send 'OFF' command");
      }
    }
  }
  

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('stylesheets'));
app.use(morgan('common'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home Control' });
});

app.use(bodyParser.json());

connection.connect(error => {
  if (error) {
    console.error('Erreur de connexion à MySQL:', error.stack);
    return;
  }

  console.log('Connecté à MySQL avec l\'ID', connection.threadId);

  // Get the initial light state and send it to the Arduino
  connection.query('SELECT state FROM devices WHERE type = "light"', (error, results, fields) => {
    if (error) {
      console.error("Error getting initial light state:", error);
    } else {
      console.log("Initial device state found:", results[0]);
      sendLedStateToArduino(results[0].state);
    }
  });

  // ... Rest of the code ...
});

app.post('/update-light-state', (req, res) => {
  const newState = req.body.state;

  console.log('Before updating light state in the database');

  connection.query('UPDATE devices SET state = ? WHERE type = "light"', [newState], (error, results, fields) => {
    if (error) {
      console.error("Error updating light state:", error);
      res.status(500).json({ error: "Failed to update light state" });
    } else {
      console.log("Light state updated successfully");
      res.json({ success: true });

      //arduino connect
      sendLedStateToArduino(newState);
      console.log('After updating light state in the database');
    }
  });
});

app.get('/get-light-state', (req, res) => {
  console.log("Received GET /get-light-state request");

  connection.query('SELECT state FROM devices WHERE type = "light"', (error, results, fields) => {
    if (error) {
      console.error("Error getting light state:", error);
      res.status(500).json({ error: "Failed to get light state" });
    } else {
      console.log("Device found:", results[0]);
      res.json({ state: results[0].state });
    }
  });
});

app.post('/update-outlet-state', (req, res) => {
  const newState = req.body.state;

  connection.query('UPDATE devices SET state = ? WHERE type = "outlet"', [newState], (error, results, fields) => {
    if (error) {
      console.error("Error updating outlet state:", error);
      res.status(500).json({ error: "Failed to update outlet state" });
    } else {
      console.log("Outlet state updated successfully");
      res.json({ success: true });
    }
  });
});

app.get('/get-outlet-state', (req, res) => {
  connection.query('SELECT state FROM devices WHERE type = "outlet"', (error, results, fields) => {
    if (error) {
      console.error("Error getting outlet state:", error);
      res.status(500).json({ error: "Failed to get outlet state" });
    } else {
      console.log("Device found:", results[0]);
      res.json({ state: results[0].state });
    }
  });
});

app.listen(3000, () => {
  console.log('Example app listening on port 3000! at : http://localhost:3000');
});

