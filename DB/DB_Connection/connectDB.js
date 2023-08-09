const mongoose = require("mongoose");
require("dotenv").config();


const connectToDB = async()=>{
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING , {
        bufferCommands : false
    }).then(()=>{
        console.log("Connected With DB")
    }).catch((err)=>{
        console.log(err);
        connectToDB;
    })
}





module.exports = connectToDB;