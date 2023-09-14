const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const CPSmapper = require("../functions/CPSmapper");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.Stone_NO));


        const mappedObj = {
            _id: id,
            source: "Brahmani",
            lotNo: element.Stone_NO,
            stoneId: element.Lab_Report_No,
            status: element.StockStatus,
            image: element.Stone_Img_url,
            video: element.Video_url,
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.Cut,
            polish: element.Polish,
            symmetry: element.Symm,
            fluorescence: element.FlrIntens,
            carat: parseFloat(element.Weight),
            discountPercent: parseFloat(element.SaleDis),
            pricePerCarat: parseFloat(element.SaleRate),
            amount: parseFloat(element.SaleAmt),
            rapRate: parseFloat(element.LiveRAP),
            lab: element.Lab,
            measurement: element.Measurement,
            totalDepthPercent: parseFloat(element.Total_Depth_Per),
            tablePercent: parseFloat(element.Table_Diameter_Per),
            shade: element.Shade,
            eyeClean: element.Eyeclean,
            keyToSymbols: element.KeyToSymbols,
            milky: element.Milkey,
            crownHeight: parseFloat(element.CrownHeight),
            crownAngle: parseFloat(element.CrownAngle),
            pavilionHeight: parseFloat(element.PavillionHeight),
            pavilionAngle: parseFloat(element.PavillionAngle),
            location: element.Location,
            purity: element.Tinge,
            length: element.Diameter_Max,
            width: element.Diameter_Min,
            depth: element.Total_Depth,
            Inscription: element.Laser_Inscription,
            Ratio: element.Ratio.toString(),
            HeightAboveGirdle: element.LowerHalve,
            StoneType: "Lab",
            natural: false,
            labReportComment: element.Lab_Report_Comment,
            CommissionPer: element.Commission_Per || 0,
            RetailPrice: element.RetailPrice || -1
        }


        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;

        
        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.20 || mappedObj.carat > 30 ||mappedObj.stoneId === "575376958" || mappedObj.stoneId === "576326930"  ){

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
    await DiamondModel.deleteMany({"source" : "Brahmani"})

    axios.post("http://brahmani.diamx.net/API/StockSearch?APIToken=8e061b21-5c46-4203-b62b-84be032fe71f").then(async (fetch)=>{
        const fetchedData = fetch.data.StoneList;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0])
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
    const fetch = await axios.post("http://brahmani.diamx.net/API/StockSearch?APIToken=8e061b21-5c46-4203-b62b-84be032fe71f");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

