const express = require("express");
const DB_Connection = require("./DB/DB_Connection/connectDB");
const {Worker} = require("node:worker_threads");
const cors = require('cors');

const app = express();
const port = process.env.port || 3000



    DB_Connection();    



    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://www.pallotta.co');
        // You can include more headers if needed
        res.setHeader('Access-Control-Allow-Methods', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        next();
      });

//const worker = new Worker("./multiThreading/updateWorker.js");
app.use(cors());
//load Routes 
const SupplierFeed = require("./Routes/SupplierFeed/SupplierFeed");
const AdminAuth = require("./Routes/Authentication/admin");
const Diamonds = require("./Routes/Diamonds/getDiamonds");
const Commission = require("./Routes/Commission/Commission");
//Routes

app.use("/SupplierFeed" , SupplierFeed);
app.use("/Auth/Admin" , AdminAuth);
app.use("/data" , Diamonds);
app.use("/Commission" ,Commission );
//Connection
app.listen(port , ()=>{
    console.log("This is Port " + port + " call me to get data :)");
})