const express = require("express");
const AdminModel =require("../../DB/Schema/AdminSchema");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const Router = express();

Router.post("/login" , bodyParser.json() , async(req , res , next)=>{
    const {reqEmail , reqPassword} = req.body;
    const dbCredentials = await AdminModel.findOne({"email" : reqEmail});
    if(dbCredentials === null){
        res.status(401).json({"Error" : "Invalid Credentials" , "login" : false})
    }else{
        const {encryptedPassword} = dbCredentials;
        bcrypt.compare(reqPassword , encryptedPassword , (err , result)=>{
            if (err) {
                res.status(500).json({"Error" : "Invalid Credentials" , "login" : false})
              } else if (result) {
                console.log("passed")
                res.status(200).json({"Message" : "Success" , "login" : true})
              } else {
                res.status(401).json({"Error" : "Invalid Credentials" , "login" : false})
              }
        })
    }
})


Router.post("/signUp" ,  async(req , res , next)=>{
const saltRounds = 10; 
console.log("callled");
const plaintextPassword = 'Diamonds12345'; 

bcrypt.hash(plaintextPassword, saltRounds, (err, hashedPassword) => {
    console.log(hashedPassword)
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    AdminModel.create({
        "email" : "admin@pallottajewellers.com",
        "encryptedPassword" : hashedPassword
    })
    res.status(200).json({hashedPassword});
  }
});

})

module.exports = Router;