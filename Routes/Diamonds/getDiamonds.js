const express = require("express");
const Diamonds = require("../../DB/Schema/DiamondSchema");
const bodyParser = require("body-parser");
const WebSocket = require('ws');
const http = require('http');
const Router = express.Router();

Router.get("/diamonds" , async (req , res , next)=>{
    const query = req.query;
    const pageNumber = query.pageNumber || 1;
    const numberOfEntries =  100;
    const queryMapper = {

    }

    if(query.source){
        queryMapper.source = query.source 
    }

    if(query.natural){
        queryMapper.natural = query.natural === "true" 

    }

    if(query.stock){
        queryMapper.lotNo = query.stock
    }
    if(query.stoneId){
        queryMapper.stoneId = query.stoneId
    }

    console.log(queryMapper);


   
      const count = await  Diamonds.countDocuments(queryMapper);
     const data = await Diamonds.find(queryMapper).skip((pageNumber-1)*numberOfEntries).limit(numberOfEntries).lean() ;
     console.log("found");
    res.status(200).json({data , count});

    

})


Router.post("/diamonds" , bodyParser.json() , async (req , res , next)=>{
    

    const query = req.body;
    console.log(query);
    const count = await Diamonds.count(query);
    const data = await Diamonds.find(query).limit(100);
    console.log(count)
    res.status(200).json({data , count})
})



Router.get("/diamonds/sort/:path", async(req , res ,next)=>{
  
  const path = req.params.path;
  const data = await Diamonds.find().sort({"carat" : path}).allowDiskUse(true).limit(100);
  res.status(200).json(data)
})


Router.get('/data-stream', (req, res) => {
    const app = express();
    const server = http.createServer(app);
    console.log("called");
    const wss = new WebSocket.Server({ server });
    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');
      
        // Fetch data from MongoDB and send it as WebSocket messages
        Diamonds.find().cursor().eachAsync((doc) => {
          ws.send(JSON.stringify(doc));
        }).then(() => {
          console.log('Data streaming complete');
        });
      
        // Clean up on client disconnect
        ws.on('close', () => {
          console.log('Client disconnected from WebSocket');
        });
      });
      

    });



module.exports = Router