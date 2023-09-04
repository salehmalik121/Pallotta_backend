const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.ReportNo));
        const mappedObj = {
            _id: id,
            source: "Mereya",
            lotNo : element.Ref,
            stoneId: element.ReportNo,
            status: element.Status,
            image: element.ImageURL,
            video: element.VideoURL,
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.Cut,
            polish: element.Polish,
            symmetry: element.Sym,
            fluorescence: element.Flour,
            carat: element.Size,
            discountPercent: "-" + element.Disc,
            pricePerCarat: element["Price/Carat"],
            amount: element.Rate, // Calculate the amount based on pricePerCarat and carat
            rapRate: element.RapRate,
            lab: element.Cert,
            measurement: `${element.M1}-${element.M2}*${element.M3}`,
            totalDepthPercent: element.Depth,
            tablePercent: element.Table,
            shade: element.FCColor, // Adjust this property name as needed
            eyeClean: element.EyeClean,
            keyToSymbols: element.Feed,
            milky: element.Milky,
            crownHeight: element.CrHeight,
            crownAngle: element.CrAng,
            pavilionHeight: element.PavDepth,
            pavilionAngle: element.PavAngle,
            location: element.Location,
            comments: element.Comment,
            luster: element.CrownInclusion,
            girdle: element.Girdle,
            girdlePercent: element.GirdlePer,
            culet: element.Culet,
            labReportComment: element.Comment,
            Inscription: element.LaserInscription,
            StoneType: "Laboratory Grown",
            natural: false
        }


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
    await DiamondModel.deleteMany({"source" : "Mereya"});
    const data = JSON.stringify({
        "uniqID":8,
        "company":"PALLOTTA JEWELLERS",
        "actCode":"PMera#43!@23",
        "selectAll":"All",
        "StartIndex":1,
        "count":10,
        "columns":"",
        "finder":"",
        "sort":""
        
    })

    var config = {
        method: 'post',
        url: 'https://stock.meraya.one/MerayaWebApi/api/LgStockApi/getDiamondData',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };

    axios(config).then(async (fetch)=>{
        const fetchedData = fetch.data.DataList;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.create(mappedArray).then(()=>{
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
    const config = JSON.stringify({
        "uniqID":8,
        "company":"PALLOTTA JEWELLERS",
        "actCode":"PMera#43!@23",
        "selectAll":"All",
        "StartIndex":1,
        "count":10,
        "columns":"",
        "finder":"",
        "sort":""
        
    })
    const fetch = await axios.post("stock.meraya.one/MerayaWebApi/api/LgStockApi/getDiamondData" , config);
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

