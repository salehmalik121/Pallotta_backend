const express = require("express");
const Diamonds = require("../../DB/Schema/DiamondSchema");
const bodyParser = require("body-parser");

const Router = express.Router();

Router.get("/diamonds" , async (req , res , next)=>{
    const query = req.query;
    const pageNumber = query.pageNumber || 1;
    const numberOfEntries = query.numberOfEntries || 20;
    const queryMapper = {

    }

    if(query.source){
        queryMapper.source = query.source
    }

    if(query.natural){
        queryMapper.natural = query.natural === "true" 

    }
    console.log(queryMapper);

    const data = await Diamonds.find(queryMapper).skip((pageNumber-1)*numberOfEntries).limit(numberOfEntries);

    res.status(200).json({data});
})


Router.post("/diamonds" , bodyParser.json() , async (req , res , next)=>{
    

    const query = req.body;
    console.log(query);
   const data = await Diamonds.find(query);
    console.log("found")
    res.status(200).json(data)
})


module.exports = Router