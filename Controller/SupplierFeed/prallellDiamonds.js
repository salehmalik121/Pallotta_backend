const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const xml2js = require('xml2js');

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.Certificate_x0020_No[0]));
       
       
        const mappedObj =  {
            _id : id,
            source: "ParallelDiamonds",
            lotNo: element.Stone_x0020_Id[0],
            stoneId: element.Certificate_x0020_No[0],
            status: element.Status[0],
            image: element.Image[0],
            video: element.Video[0],
            shape: element.Shape[0],
            color: element.Color[0],
            clarity: element.Clarity[0],
            cut: element.Cut[0],
            polish: element.Polish[0],
            symmetry: element.Symmetry[0],
            fluorescence: element.FL[0],
            carat: parseFloat(element.Carat[0]),
            discountPercent: parseFloat(element.Disc_x0020__x0025_[0]),
            pricePerCarat: parseFloat(element.Price_x002F_Ct[0]),
            amount: parseFloat(element.Amount[0]),
            rapRate: parseFloat(element.RapRate[0]),
            lab: element.LAB[0],
            measurement: element.Measurement[0],
            totalDepthPercent: parseFloat(element.TotDepth_x0020__x0025_[0]),
            tablePercent: parseFloat(element.Tab_x0025_[0]),
            shade: element.Shade[0],
            eyeClean: element.Eye_x0020_Clean[0],
            keyToSymbols: element.Key_x0020_To_x0020_Sym[0],
            brown: element.Brown[0],
            milky: element.Milky[0],
            tabBlack: element.TabBlack[0],
            centerInc: element.CenterInc[0],
            sideBlack: element.SideBlack[0],
            girdle: element.Girdle[0],
            girdlePercent: parseFloat(element.Girdle_x0025_[0]),
            crownHeight: parseFloat(element.CR_x0020_Hgt[0]),
            crownAngle: parseFloat(element.CR_x0020_Ang[0]),
            pavilionHeight: parseFloat(element.PV_x0020_Hgt[0]),
            pavilionAngle: parseFloat(element.PV_x0020_Ang[0]),
            luster: element.Luster[0],
            culet: element.Culet[0],
            comments: element.Comments[0],
            location: element.Location[0],
            uploadDate: new Date(element.UploadDate[0]),
            certificatePath: element.CertPath[0],
            reportNo: element.Certificate_x0020_No[0],
            StoneType: "Lab",
            natural: false
        }
       
        
        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.25 || mappedObj.carat > 25 ){

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
    await DiamondModel.deleteMany({"source" : "ParallelDiamonds"});
    axios.post("http://www.paralleldiamonds.com/api/getstock?user=yYCmfzrsYkv0jPbFdbfYtQ==&key=vh2E6JUyoL3sN15Cxx5NlebYgjNQFmeIYte9AZA7TVE=").then(async (fetch)=>{
        const fetchedData = fetch.data.toString();
        const parser = new xml2js.Parser();
        parser.parseString(fetchedData, async(error, result) => {
            if (error) {
                console.error('Error parsing XML:', error);
            } else {
                const mappedArray = await SchemaMapping(result.Inventory.ExcelData);
                console.log(mappedArray[0]);
                DiamondModel.create(mappedArray).then(()=>{
                    res.sendStatus(200);
                }).catch(err=>{
                    console.log(err);
                    res.status(500).json(err);
                })
            }
        });
      

    }).catch((err)=>{
        console.log(err);
    })
}


exports.fetchJeniData = async ()=>{
    const fetch = await axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

