const express = require("express");
const Diamonds = require("../../DB/Schema/DiamondSchema");

const Router = express.Router();

Router.get("/diamonds" , async (req , res , next)=>{
    const query = req.query;
    const pageNumber = query.pageNumber || 1;
    const queryMapper = {
    }

    if(query.source){
        queryMapper.source = query.source;
    }

    const data = await Diamonds.find(queryMapper).skip(0).limit(10);

    res.status(200).json({data});
})


module.exports = Router