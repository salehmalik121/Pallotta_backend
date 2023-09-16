const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const CPSmapper = require("../functions/CPSmapper");
const Supplier = require("../../Class/Supplier");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const certNo = element.CertificateLink;
        const div = certNo.split("/");
        const subDiv = div[div.length - 1].split(".")[0]
        let certNumber = subDiv;

        const price = parseInt(element.Buy_Price) * parseFloat(element.Weight)
        const roundAmount = Math.round(price/5)*5
        const pricePerCaret = element.Buy_Price;

        const length = element.Measurements.split("X")[0];
        const width = element.Measurements.split("X")[1];
        const depth = element.Measurements.split("X")[2];

        const id = new mongoose.Types.ObjectId(parseInt(certNumber));


        const mappedObj = {
            _id: id,
            source: "Belgium",
            lotNo: element.Stock_No,
            stoneId: certNumber,
            status: element.Availability,
            image: element.ImageLink,
            video: element.VideoLink,
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.Cut_Grade,
            polish: element.Polish,
            symmetry: element.Symmetry,
            fluorescence: element.Fluorescence_Intensity,
            carat: parseFloat(element.Weight),
            discountPercent: element.Buy_Price_Discount_PER, // Set default discount percent if not provided in JSON
            pricePerCarat: pricePerCaret, // Set default price per carat if not provided in JSON
            amount: roundAmount, // Set default amount if not provided in JSON
            rapRate: parseFloat(element.Rap_Price),
            lab: element.Lab,
            measurement: element.Measurements,
            totalDepthPercent: parseFloat(element.DEPTH_PER),
            tablePercent: parseFloat(element.TABLE_PER),
            shade: element.Shade,
            eyeClean: element.Eye_Clean,
            keyToSymbols: element.Key_To_Symbols,
            milky: element.Milky,
            crownHeight: 0 ,
            crownAngle: 0,
            pavilionHeight: 0,
            pavilionAngle: 0,
            location: element.Country + ', ' + element.State + ', ' + element.City,
            purity: element.Country_Of_Origin,
            length: length,
            width: width,
            depth: depth,
            Inscription: element.Gemprint_ID,
            Ratio: element.Ratio,
            HeightAboveGirdle: element.HEIGHT_ABOVE,
            StoneType: element.Diamond_Type,
            natural: element.Diamond_Type === "Natural Diamond"
        }


        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;
        mappedObj.sclarity = mappedCPS.cls;

        
        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.20 || mappedObj.carat > 30  ){

        }else{

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX"]


            
           
            if (
                AcceptedShape.includes(mappedObj.shape) &&
                AcceptedColor.includes(mappedObj.color) &&
                AcceptedClarity.includes(mappedObj.clarity) &&
                AcceptedCPS.includes(mappedObj.cut) && 
                AcceptedCPS.includes(mappedObj.polish) && 
                AcceptedCPS.includes(mappedObj.symmetry)
              ) {
                mappedArray.push(mappedObj);
              }
        }
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "Belgium"})

    axios.get("https://belgiumdia.com/api/DeveloperAPI?APIKEY=727463ab757f49ef2461d52f9565d4f025b2d3d7e79d").then(async (fetch)=>{
        const fetchedData = fetch.data.Stock;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.create(mappedArray).then(()=>{
            const SupplierUp = new Supplier("Belgium");
            SupplierUp.SyncCommission();
            res.sendStatus(200);
        }).catch(err=>{
            console.log(err);
            res.status(500).json(err);
        })

    }).catch((err)=>{
        console.log(err);
    })
}


exports.fetchJeniData = async ()=>{
    const fetch = await axios.get("https://belgiumdia.com/api/DeveloperAPI?APIKEY=727463ab757f49ef2461d52f9565d4f025b2d3d7e79d");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

