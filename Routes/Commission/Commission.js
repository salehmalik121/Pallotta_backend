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
    
    const filteredData = await Diamonds.find(body.FilterQuery);

    console.log(body.commissionValue);

     filteredData.forEach(async(element) => {
        const retailPrice = element.amount + (body.commissionValue *  element.amount) /100 ;
        const roundAmount = Math.round(retailPrice/5)*5
        console.log("value " + roundAmount )
        await Diamonds.updateOne({"_id" : element._id} , {
            "RetailPrice" : roundAmount,
            "CommissionPer" : body.commissionValue
        }).then(found=>{
            console.log(found)
        }).catch(err=>{
            console.log(err);
        })
    });


    console.log("saved");
    res.status(200).json({});
})


module.exports = Router