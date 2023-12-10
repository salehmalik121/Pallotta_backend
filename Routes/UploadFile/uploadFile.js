const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const CPSmapper = require("../../Controller/functions/CPSmapper");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")
const Supplier = require("../../Class/Supplier");

const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

Router.post("/natural" , upload.single("excelFile") , async (req , res , next)=>{

    const excelBuffer = req.file.buffer;

    const workbook = xlsx.read(excelBuffer , {type: "buffer"});

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    let mappedArray = [];

    data.map(async(element)=>{
        if(element['Stock #'] != undefined){
        const id = new mongoose.Types.ObjectId(parseInt(element['Stock #']));
        let mappedObj = {
              source : "pallotta",
              lotNo: element["Stock #"],
              stoneId: element['Lab\tReport #'],
              shape : element.Shape,
              color : element.Color,
              clarity : element.Clarity,
              cut : element.Cut,
              polish : element.Polish,
              symmetry : element.Symmetry,
              fluorescence : element['Fluorescence '], // Note the space in the key name
              measurement : element.Measurements,
              lab : element.Grade, // Note the tab character in the key name
              carat : element.Weight,
              amount : element['Amount USD'],
              totalDepthPercent : element['Depth %'],
              tablePercent : element['Table %'],
              girdle : element.Girdle,
              crownHeight : element['Crown Height'],
              pavilionHeight : element['Pavilion Depth'],
              "natural" : true,
              StoneType: "Natural",

        }

        mappedObj.shape.toUpperCase();
        const allowedColors = ["D", "E", "F", "G", "H", "I", "J"];
if (!allowedColors.includes(mappedObj.color)) {
    mappedObj.colored = true;
}


        if (mappedObj.clarity == "SI 2 ") {
            mappedObj.clarity = "SI2";
        } else if (mappedObj.clarity == "SI 1 ") {
            mappedObj.clarity = "SI1";
        } else if (mappedObj.clarity == "VS 2 ") {
            mappedObj.clarity = "VS2";
        } else if (mappedObj.clarity == "VS 1 ") {
            mappedObj.clarity = "VS2";
        } else if (mappedObj.clarity == "VVS 2 ") {
            mappedObj.clarity = "VVS2";
        } else if (mappedObj.clarity == "VVS 1 ") {
            mappedObj.clarity = "VVS1";
        } else {
            // Handle the default case if needed
        }
        
        if (mappedObj.polish == "Very Good") {
            mappedObj.polish = "VG";
        } else if (mappedObj.polish == "Good") {
            mappedObj.polish = "G";
        } else if (mappedObj.polish == "Excellent") {
            mappedObj.polish = "EX";
        } else if (mappedObj.polish == "Ideal") {
            mappedObj.polish = "I";
        } else {
            // Handle the default case if needed
        }
        
        if (mappedObj.cut == "Very Good") {
            mappedObj.cut = "VG";
        } else if (mappedObj.cut == "Good") {
            mappedObj.cut = "G";
        } else if (mappedObj.cut == "Excellent") {
            mappedObj.cut = "EX";
        } else if (mappedObj.cut == "Ideal") {
            mappedObj.cut = "I";
        } else {
            // Handle the default case if needed
        }
        
        if (mappedObj.symmetry == "Very Good") {
            mappedObj.symmetry = "VG";
        } else if (mappedObj.symmetry == "Good") {
            mappedObj.symmetry = "G";
        } else if (mappedObj.symmetry == "Excellent") {
            mappedObj.symmetry = "EX";
        } else if (mappedObj.symmetry == "Ideal") {
            mappedObj.symmetry = "I";
        } else {
            // Handle the default case if needed
        }
        

        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;
        mappedObj.sclarity = mappedCPS.cls;
        mappedArray.push(mappedObj);
    }
    })

    


    const bulkOperations = mappedArray.map(data => {
        const filter = { stoneId: data.stoneId };
        const update = { $set: data };
        return {
          updateOne: {
            filter,
            update,
            upsert: true,
          },
        };
      });
      await bulkOperations.map(async(operation) => {await DiamondModel.findOneAndDelete(operation.updateOne.filter)});
      DiamondModel.bulkWrite(bulkOperations, { ordered: false })
        .then(result => {
          console.log(result);
          res.sendStatus(200);
        })
        .catch(error => {
          console.error(error);
          res.status(500).json(error);
        });

    const SupplierUp = new Supplier("pallotta");
    SupplierUp.SyncCommission();
    
    
})

Router.post("/lab" , upload.single("excelFile") , async (req , res , next)=>{
    const excelBuffer = req.file.buffer;

    const workbook = xlsx.read(excelBuffer , {type: "buffer"});

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(sheet);

    const mappedArray = [];

    data.forEach((element)=>{
        const id = new mongoose.Types.ObjectId(parseInt(element['Lab Report #']));
        const certLink = element['Lab Report #'];
        let parsedCertNumber = certLink?.split("=")[1];
        if(parsedCertNumber == undefined){
            parsedCertNumber = certLink;
        }
        let mappedObj = {
            lotNo: element["Stock #"],
              source : "pallotta",
              stoneId: parsedCertNumber,
              lotNo: element["Stock #"],
              shape : element.Shape,
              color : element.Color,
              clarity : element.Clarity,
              cut : element.Cut,
              polish : element.Polish,
              symmetry : element.Symmetry,
              fluorescence : element['Fluorescence '], // Note the space in the key name
              measurement : element.Measurements,
              lab : element.Grade, // Note the tab character in the key name
              carat : element.Weight,
              amount : element['Amount USD'],
              totalDepthPercent : element['Depth %'],
              tablePercent : element['Table %'],
              girdle : element.Girdle,
              crownHeight : element['Crown Height'],
              pavilionHeight : element['Pavilion Depth'],
              "natural" : false,
              StoneType: "Lab",

        }


        mappedObj.shape.toUpperCase()

        const allowedColors = ["D", "E", "F", "G", "H", "I", "J"];
if (!allowedColors.includes(mappedObj.color)) {
    mappedObj.colored = true;
}

        switch (mappedObj.clarity) {
            case "SI 2":
                mappedObj.clarity = "SI2"
                break;
            case "SI 1":
                mappedObj.clarity = "SI1"
                break;
            case "VS 2":
                mappedObj.clarity = "VS2"
                break;
            case "VS 1":
                mappedObj.clarity = "VS2"
                break;
            case "VVS 2":
                mappedObj.clarity = "VVS2"
                break;
            case "VVS 1":
                mappedObj.clarity = "VVS1"
                break;
            default:
                break;
        }
        switch (mappedObj.polish) {
            case "Very Good":
                mappedObj.polish = "VG"
                break;
            case "Good":
                mappedObj.polish = "G"
                break;
            case "Excellent":
                mappedObj.polish = "EX"
                break;
            case "Ideal":
                mappedObj.polish = "I"
                break;
            default:
                break;
        }
        switch (mappedObj.cut) {
            case "Very Good":
                mappedObj.cut = "VG"
                break;
            case "Good":
                mappedObj.cut = "G"
                break;
            case "Excellent":
                mappedObj.cut = "EX"
                break;
            case "Ideal":
                mappedObj.cut = "I"
                break;
            default:
                break;
        }
        switch (mappedObj.symmetry) {
            case "Very Good":
                mappedObj.symmetry = "VG"
                break;
            case "Good":
                mappedObj.symmetry = "G"
                break;
            case "Excellent":
                mappedObj.symmetry = "EX"
                break;
            case "Ideal":
                mappedObj.symmetry = "I"
                break;
            default:
                break;
        }

        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;
        mappedObj.sclarity = mappedCPS.cls;


        console.log(mappedObj);
        mappedArray.push(mappedObj);

    })




   // Assuming mappedArray is an array of objects you want to insert or update
   const bulkOperations = mappedArray.map(data => {
    const filter = { stoneId: data.stoneId };
    const update = { $set: data };
    return {
      updateOne: {
        filter,
        update,
        upsert: true,
      },
    };
  });
  
  DiamondModel.bulkWrite(bulkOperations, { ordered: false })
    .then(result => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json(error);
    });
  
    const SupplierUp = new Supplier("pallotta");
    SupplierUp.SyncCommission();
    
})

module.exports = Router;