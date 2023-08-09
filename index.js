const express = require("express");
const DB_Connection = require("./DB/DB_Connection/connectDB");
const {Worker} = require("node:worker_threads");


const app = express();
const port = process.env.port || 3000

DB_Connection();
//const worker = new Worker("./multiThreading/updateWorker.js");
//load Routes 
const SupplierFeed = require("./Routes/SupplierFeed/SupplierFeed");

//Routes

app.use("/SupplierFeed" , SupplierFeed);


//Connection
app.listen(port , ()=>{
    console.log("This is Port " + port + " call me to get data :)");
})