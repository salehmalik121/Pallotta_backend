const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");


const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"]));
        
        const weight = parseFloat(element["Weight"]); 
        const disc = parseFloat(element["GPer"].split('-')[1]);
        const discPrice = (parseFloat(element["Org Rap"]) * disc) / 100;
        const pricePC = parseInt(element["Org Rap"]) - discPrice;
        const price = pricePC * weight;
        const roundAmount = Math.round(price/5)*5
        const rapNetPrice = parseFloat(element["RapNet Price"])
        const pricePerCarat = pricePC;
        const length = element["Measurements"].split("x")[0];
        const width = element["Measurements"].split("x")[1];
        const depth = element["Measurements"].split("x")[2];
        const ratio = length/width;

        const mappedObj = {
            _id : id,
            "source" : "Brahma",
            "lotNo" : element["Stock #"],
            "stoneId" : element["Certificate #"],
            "status" : element["Availability"],
            "image" : element["Diamond Image"],
            "video" : element["Diamond Video"],
            "shape" : element["Shape"],
            "color" : element["Color"],
            "clarity" : element["Clarity"],
            "cut" : element["Cut Grade"],
            "polish" : element["Polish"],
            "symmetry" : element["Symmetry"],
            "fluorescence" : element["Fluorescence Intensity"],
            "carat" : element["Weight"],
            "discountPercent" : element["GPer"],
            "pricePerCarat" : pricePerCarat,
            "amount" : roundAmount,
            "rapRate" : element["Org Rap"],
            "lab" : element["Lab"],
            "measurement" : element["Measurements"],
            "totalDepthPercent" : element["Depth %"],
            "tablePercent" : element["Table %"],
            "shade" : element["Shade"],
            "keyToSymbols" : element["Key To Symbols"],
            "milky" : element["Milky"],
            "crownHeight" : element["Crowhn Height"],
            "crownAngle" : element["Crown Angle"],
            "pavilionHeight" : element["Pavilion Depth"],
            "pavilionAngle" : element["Pavilion angle"],
            "location" : element["Country"],
            "purity" : element["Clarity"],
            "length" : length,
            "width" : width,
            "depth" : depth,
            "Inscription" : element["Inscription"],
            "Ratio" : ratio,
            natural : false,
            StoneType : "Lab"
        }

        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.20 || mappedObj.carat > 30  ){

        }else{

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX"]


            if(mappedObj.cut === "ID"){
                mappedObj.cut = "I"
            }
           
            if (
                true
              ) {
                mappedArray.push(mappedObj);
              }
        }
    });
    return mappedArray;
}



exports.MapData =  async (req , res)=>{

    await DiamondModel.deleteMany({"source" : "Brahma"});
    console.log("deleted");

    axios.get("http://gi.peacocktech.in/GodhaniImpex.asmx/GetStock?token=PEACO-CKTEC-H2022-PALOT").then(async (fetch)=>{
        const fetchedData = fetch.data.Result;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.insertMany(mappedArray).then(()=>{
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })

    }).catch((err)=>{
        console.log(err);
    })
}


exports.fetchData = async ()=>{
    const fetch = await axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

