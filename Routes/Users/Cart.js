const express = require("express");
const User = require("../../DB/Schema/User");
const Diamonds = require("../../DB/Schema/DiamondSchema")
const bodyParser = require("body-parser");
const Router = express.Router();
Router.get("/AddToCart/:email/:diamondId" , bodyParser.json() , async (req , res)=>{
    const email = req.params.email;
    const stoneId = req.params.diamondId;

    const diamondData = await Diamonds.findOne({"stoneId" : stoneId});

    User.updateOne(
        { email: email }, 
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

Router.get("/cartList/:email" , async(req , res)=>{
  const email = req.params.email;
 const userData = await User.findOne({email : email });
 const cartList = userData.cartList;
 res.status(200).json({cartList});
})


Router.delete("/cartList/:email/:stoneId" , async(req , res)=>{
    const userEmail = req.params.email;
    const stoneId = req.params.stoneId;

    
    User.findOneAndUpdate(
      { email: userEmail },
      { $pull: { cartList: { stoneId: stoneId } } },
      { new: true }
    ).then(dbRes => {
      res.status(200).json({"updatedCart" : dbRes.cartList});
    }).catch(err=>{
      console.log(err)
    })


})

module.exports = Router;