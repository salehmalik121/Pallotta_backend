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
    

    const params = req.query;
    const query = req.body;
    const pageNumber = params.pageNumber - 1 || 0;
    const count = await Diamonds.count(query);
    const skip = pageNumber * 100;

    if(query.source){
      query.source = query.source 
  }

  if(query.natural){
    query.natural = query.natural === "true" 
  }

  if(query.stock){
      query.lotNo = query.stock
  }
  if(query.stoneId){
      query.stoneId = query.stoneId
  }

  console.log(query);

    // logics

    if(params.sorting === "true"){
      const direction = params.direction;
      const sortingParameter = params.sortingParameter
      if(direction === "asc"){
        
        const data = await Diamonds.find(query).sort({ [sortingParameter] : 1}).allowDiskUse(true).skip(skip).limit(100);
        res.status(200).json({data , count})
        next()
      }else{
        const data = await Diamonds.find(query).sort({ [sortingParameter] : -1}).allowDiskUse(true).skip(skip).limit(100);
        res.status(200).json({data , count})
        next()
      }
    }else{

    const data = await Diamonds.find(query).skip(pageNumber * 100).limit(100); // data Retrival
    console.log(count)
    res.status(200).json({data , count})}
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