const jeniController = require("../Controller/SupplierFeed/jeniController");
const updateManger = require("../UpdateManger/updateManger");
const connectDB = require("../DB/DB_Connection/connectDB");
const updateWorker = async ()=>{
    console.log("updating");
    //jeni update 
    const jeniNewData = await jeniController.fetchJeniData();
    updateManger.updateManger(jeniNewData , "jeni");
}


connectDB();
const interval = 15 * 60 * 1000;
setInterval(updateWorker , interval);