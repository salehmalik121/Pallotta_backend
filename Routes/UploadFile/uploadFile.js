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

    const mappedArray = [];

    data.forEach((element)=>{
        const id = new mongoose.Types.ObjectId(parseInt(element['Lab\tReport #']));
        const mappedObj = {
              _id: id,
              source : "pallotta",
              stoneId: element['Lab\tReport #'],
              shape : element.Shape,
              color : element.Color,
              clarity : element.Clarity,
              cut : element.Cut,
              polish : element.Polish,
              symmetry : element.Symmetry,
              fluorescence : element['Fluorescence '], // Note the space in the key name
              measurement : element.Measurements,
              lab : element['Lab\tReport #'], // Note the tab character in the key name
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


        mappedObj.shape.toUppercase

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



        mappedArray.push(mappedObj);

    })





    await DiamondModel.deleteMany({"source" : "pallotta"});
    DiamondModel.insertMany(mappedArray, {ordered : false}).then((saved)=>{
        console.log(saved);
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(200).json(err);
    })

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
        const id = new mongoose.Types.ObjectId(parseInt(element['Lab\tReport #']));
        const mappedObj = {
              _id: id,
              source : "pallotta",
              stoneId: element['Lab\tReport #'],
              shape : element.Shape,
              color : element.Color,
              clarity : element.Clarity,
              cut : element.Cut,
              polish : element.Polish,
              symmetry : element.Symmetry,
              fluorescence : element['Fluorescence '], // Note the space in the key name
              measurement : element.Measurements,
              lab : element['Lab\tReport #'], // Note the tab character in the key name
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


        mappedObj.shape.toUppercase

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



        mappedArray.push(mappedObj);

    })





    await DiamondModel.deleteMany({"source" : "pallotta"});
    DiamondModel.insertMany(mappedArray, {ordered : false}).then((saved)=>{
        console.log(saved);
        res.sendStatus(200);
    }).catch(err=>{
        console.log(err);
        res.status(500).json(err);
    })
    
    
})

module.exports = Router;