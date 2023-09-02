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


Router.patch("/", bodyParser.json(), async (req, res, next) => {
  try {
    const saltRounds = 10;
    
    // Extract the request body
    const body = req.body;
    const plaintextPassword = body.pass;
    
    // Hash the plaintext password using bcrypt
    bcrypt.hash(plaintextPassword, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ "error": "Internal server error" });
      } else {
        // Retrieve the admin data
        const data = await AdminModel.find();
        const id = data[0]._id;

        // Update the admin's email and encrypted password
        await AdminModel.findByIdAndUpdate(id, {
          "email": body.email,
          "encryptedPassword": hashedPassword
        });

        return res.status(200).json({ "msg": "Update successful" });
      }
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ "error": "Internal server error" });
  }
});


Router.patch("/email" , bodyParser.json() , async(req , res , next)=>{
  const newEmail = req.body;
  const data = await Admin.find();
  const id = data[0]._id;
  

  AdminModel.findOneAndUpdate({"_id" : id} , {"email" : newEmail.email}).then(msg=>{
    console.log(msg);
    res.status(200).json({"msg" : "updates"})
  }).catch(err=>{
    console.log(err);
    res.status(500).json({"msg" : "internal Server Error"})
  })

})


Router.patch("/password" , bodyParser.json() , async(req , res , next)=>{
  try {
    const saltRounds = 10;
    
    // Extract the request body
    const body = req.body;
    const plaintextPassword = body.pass;
    
    // Hash the plaintext password using bcrypt
    bcrypt.hash(plaintextPassword, saltRounds, async (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ "error": "Internal server error" });
      } else {
        // Retrieve the admin data
        const data = await AdminModel.find();
        const id = data[0]._id;

        // Update the admin's email and encrypted password
        await AdminModel.findByIdAndUpdate(id, {
          "encryptedPassword": hashedPassword
        });

        return res.status(200).json({ "msg": "Update successful" });
      }
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ "error": "Internal server error" });
  }

})


module.exports = Router;