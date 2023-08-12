const express = require("express");
const Commission = require("../../DB/Schema/comissionSchema");
const bodyParser = require("body-parser");
const Diamonds = require("../../DB/Schema/DiamondSchema");

const Router = express.Router();

Router.post("/" , bodyParser.json() , async (req , res , next)=>{
    console.log("called");
    const body = req.body;
    console.log(body.FilterQuery);
    await Commission.create(body).then(()=>{
        console.log("saved");
    }).catch(err=>{
        console.log(err);
    });
    await Diamonds.updateMany(body.FilterQuery ,{ $set: { "CommissionPer": body.commissionValue } } ).then(found=>{
        console.log(found);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
    console.log("saved");
    res.status(200).json({});
})


module.exports = Router