const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")
const CPSmapper = require("../functions/CPSmapper");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.Lab_Report_No));

        const mappedObj = {
            _id: id,
            source: "LightGrown",
            lotNo: element.Stone_NO,
            stoneId: element.Lab_Report_No, // You can adjust this based on your requirements.
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.Cut,
            polish: element.Polish,
            symmetry: element.Symm,
            fluorescence: element.FlrIntens,
            carat: parseFloat(element.Weight),
            discountPercent: element.SaleDis,
            pricePerCarat: element.SaleRate,
            amount: element.SaleAmt,
            lab: element.Lab,
            measurement: element.Measurement,
            totalDepthPercent: element.Total_Depth_Per,
            tablePercent: element.Table_Diameter_Per,
            girdle: element.GirdleName,
            culet: element.CuletSize,
            crownHeight: element.CrownHeight,
            crownAngle: element.CrownAngle,
            pavilionHeight: element.PavillionHeight,
            pavilionAngle: element.PavillionAngle,
            location: element.Location,
            purity: element.Clarity, // Note: In the provided JSON, it's "Calrity" instead of "Clarity"
            inscription: element.Laser_Inscription,
            ratio: element.Ratio,
            eyeClean: element.Eyeclean,
            milky: element.Milkey,
            StoneType: "Lab Created", // Based on the JSON structure, but you can adjust this value
            labReportComment: element.Lab_Report_Comment,
            stoneImgUrl: element.Stone_Img_url,
            videoUrl: element.Video_url,
            natural : false
        }

        if(mappedObj.cut === "ID"){
            mappedObj.cut = "I";
        }


        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;
        mappedObj.sclarity = mappedCPS.cls;

        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.20 || mappedObj.carat > 30  ){

        }else{

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J" , "G"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX" , "ID"]


            
           
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
    await DiamondModel.deleteMany({"source" : "LightGrown"});
    axios.post("https://vaishali.diamx.net/API/StockSearch/?APIToken=c7d00250-03c6-4d49-be33-dd6c751ea89e").then(async (fetch)=>{
        const fetchedData = fetch.data.StoneList;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.insertMany(mappedArray).then(()=>{
            console.log("saved")
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
    const fetch = await axios.post("https://vaishali.diamx.net/API/StockSearch/?APIToken=c7d00250-03c6-4d49-be33-dd6c751ea89e");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

