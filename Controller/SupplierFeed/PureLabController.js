const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const CPSmapper = require("../functions/CPSmapper");

    const SchemaMapping = async (fetchedData) => {
        const mappedArray = [];
    
        await fetchedData.forEach(element => {
            const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"])); // Generating a new ObjectId for each element.
            const amount = element["Price/Ct"] * element["Weight"]
            const roundAmount = Math.round(amount/5)*5
            const mappedObj = {
                _id: id,
                source: "PureLab",
                lotNo: element["Lot #"],
                stoneId: element["Certificate #"], // You can adjust this based on your requirements.
                shape: element.Shape,
                color: element.Color,
                clarity: element.Clarity,
                cut: element["Cut Grade"],
                polish: element.Polish,
                symmetry: element.Symmetry,
                fluorescence: element.Fluor,
                carat: element.Weight,
                discountPercent: "-" + element["% Off RAP"],
                pricePerCarat: element["Price/Ct"],
                amount: roundAmount,
                lab: element.Lab,
                measurement: `${element.Length} x ${element.Width} x ${element.Depth}`,
                totalDepthPercent: element["Depth %"],
                tablePercent: element["Table %"],
                inscription: element["Inscription #"],
                diamondImage: element["Diamond Image"],
                video: element.Video,
                StoneType: "Lab Created",
                natural : false,
            }

            if(mappedObj.cut === "ID"){
                mappedObj.cut = "I"
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
                  }
            }
       
    
    
    }
        
        );
    
        return mappedArray;
    }




exports.MapData =  async (req , res)=>{
    await DiamondModel.deleteMany({"source" : "PureLab"});
    console.log("deleted");

    axios.get("http://api.pld.live/stockshare/CXVZ1-YXDRT-MAVQD-A6468").then(async (fetch)=>{
        const fetchedData = fetch.data;
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
    const fetch = await axios.get("http://api.pld.live/stockshare/CXVZ1-YXDRT-MAVQD-A6468");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

