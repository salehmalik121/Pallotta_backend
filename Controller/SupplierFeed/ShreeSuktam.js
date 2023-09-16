const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")
const CPSmapper = require("../functions/CPSmapper");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.CertNo));
        const mappedObj = {
            _id: id,
            source: "Shree Suktam",
            lotNo: element.PId,
            stoneId: element.CertNo,
            status: element.S_Code,
            image: element.IMAGEPATH || "",
            video: element.MOVIEPATH || "",
            shape: element.S_NAME,
            color: element.C_Name,
            clarity: element.Q_Name,
            cut: element.CTS_Name,
            polish: element.PLS_Name,
            symmetry: element.SYMS_Name,
            fluorescence: element.FS_Name,
            carat: element.Carat,
            discountPercent: element.Disc,
            pricePerCarat: element.Rate,
            amount: element.Total,
            rapRate: element.RAP,
            lab: element.CR_Name,
            measurement: element.Measurement,
            totalDepthPercent: element.TotDepth,
            tablePercent: element.Table1,
            shade: element.BS_NAME || "",
            eyeClean: element.eyeclean || "",
            keyToSymbols: element.KeyToSym || "",
            milky: element.Milky || "",
            crownHeight: element.CHeight,
            crownAngle: element.CAngle,
            pavilionHeight: element.PHeight,
            pavilionAngle: element.PAngle,
            location: element.country || "",
            purity: element.stype,
            length: element.size || "",
            width: "",
            depth: "",
            Inscription: "",
            Ratio: element.ratio || "",
            HeightAboveGirdle: "",
            StoneType: "CVD",
            natural: !element.ISFancy,
            CommissionPer: 0, // You can set this as needed
            RetailPrice: 0, // Default value as specified in the schema
            girdle: element.Girdle || "",
            girdlePercent: element.GirdleCon || 0,
            luster: element.LU_Name || "",
            culet: "",
            comments: element.comment || "",
            certificatePath: element.CertiLink || "",
            reportNo: element.CertNo,
            packetNo: "",
            length: element.size || "",
            width: element.size || "",
            depth: element.size || "",
            natural : false
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
              } else if(
                AcceptedShape.includes(mappedObj.shape) &&
                AcceptedClarity.includes(mappedObj.clarity) &&
                AcceptedCPS.includes(mappedObj.cut) && 
                AcceptedCPS.includes(mappedObj.polish) && 
                AcceptedCPS.includes(mappedObj.symmetry)
              ){
                mappedObj.source = "Shree Suktam colored"
                mappedObj.colored = true
                mappedArray.push(mappedObj);
              }
        }
    });
    return mappedArray;
}

exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "Shree Suktam"})
    await DiamondModel.deleteMany({"source" : "Shree Suktam Colored"})

    var config = {
        method: 'get',
        url: 'https://ssdiam.in/Stock/FillStock?username=Pallotta&password=FG8945T',
        headers: { 
          'Content-Type': 'application/json'
        }
      };

    axios(config).then(async (fetch)=>{
        const fetchedData = fetch.data.Result;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.insertMany(mappedArray , {ordered : false}).then(()=>{
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
    
    const fetch = await axios.get("https://ssdiam.in/Stock/FillStock?username=Pallotta&password=FG8945T");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)
    return mappedArray;
}

