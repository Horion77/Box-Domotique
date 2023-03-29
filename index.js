const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://127.0.0.1:27017/box_domo";
const dbName = "box_domo";

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('stylesheets'));
var morgan = require('morgan');
app.use(morgan('common'));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Home Control' });
});

app.use(bodyParser.json());

let db;

const startApp = async () => {
  try {
    const client = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  
    app.post('/update-light-state', async (req, res) => {
      const newState = req.body.state;
    
      console.log('Before updating light state in the database');
      
      try {
        const result = await db.collection('devices').updateOne({ type: "light" }, { $set: { state: newState } });
        console.log("Light state updated successfully");
        res.json({ success: true });
    
        console.log('After updating light state in the database');
      } catch (err) {
        console.error("Error updating light state:", err);
        res.status(500).json({ error: "Failed to update light state" });
      }
    });
    
    
    
  
    app.get('/get-light-state', async (req, res) => {
      console.log("Received GET /get-light-state request");
      try {
        const device = await db.collection('devices').findOne({ type: 'light' });
        console.log("Device found:", device);
        res.json({ state: device.state });
      } catch (err) {
        console.error("Error getting light state:", err);
        res.status(500).json({ error: "Failed to get light state" });
      }
    });
     
    app.listen(3000, () => {
      console.log('Example app listening on port 3000! at : http://localhost:3000');
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
};

startApp();
