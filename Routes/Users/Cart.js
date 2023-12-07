const express = require("express");
const User = require("../../DB/Schema/User");
const Diamonds = require("../../DB/Schema/DiamondSchema")
const bodyParser = require("body-parser");
const Router = express.Router();
Router.get("/AddToCart/:id/:diamondId" , bodyParser.json() , async (req , res)=>{
    const userId = req.params.id;
    const stoneId = req.params.diamondId;

    const diamondData = await Diamonds.findOne({"stoneId" : stoneId});

    User.updateOne(
        { _id: userId }, 
        { $push: { "cartList": diamondData } } 
      )
        .then(result => {
          console.log(result);
          res.sendStatus(200);
        })
        .catch(error => {
          console.error(error);
          res.sendStatus(500);
        });

})

Router.get("/cartList/:id" , async(req , res)=>{
  const userId = req.params.id;
 const userData = await User.findOne({_id : userId });
 const cartList = userData.cartList;
 res.status(200).json({cartList});
})

module.exports = Router;