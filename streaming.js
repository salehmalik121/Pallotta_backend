const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const Diamonds = require('./DB/Schema/DiamondSchema'); // Import your Diamonds model
const DB_Connection = require("./DB/DB_Connection/connectDB");


const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

DB_Connection();


wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');
  
    const batchSize = 100; // Number of documents to batch together
    let batch = [];
  
    const sendBatch = () => {
      if (batch.length > 0) {
        ws.send(JSON.stringify(batch));
        batch = []; // Clear the batch after sending
      }
    };
  
    Diamonds.find().limit(5000).cursor().eachAsync((doc) => {
      batch.push(doc);
      if (batch.length >= batchSize) {
        sendBatch();
      }
    }).then(() => {
      sendBatch(); // Send any remaining documents in the batch
      console.log('Data streaming complete');
    });
  
    // Clean up on client disconnect
    ws.on('close', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

app.get('/data-stream', (req, res) => {
  res.send('WebSocket streaming route'); // Respond with a simple message
});

server.listen(3002, () => {
  console.log('WebSocket server is running on port 3002');
});