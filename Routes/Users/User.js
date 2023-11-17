const express = require("express");
const User = require("../../DB/Schema/User");
const bodyParser = require("body-parser");

Router.post("/user" , bodyParser.json() , (req , res)=>{
    const body = req.body;
    User.create(body).then(()=>{
        res.status(200).json({"message" : "user created"});
    }).catch((err)=>{
        res.status(500).json({"message" : "Server Error"});
    })
})


const Router = express();