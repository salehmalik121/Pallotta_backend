const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element["Report No"]));

        const mappedObj = {
            "_id" : id,
            "source": "Rays",
            "lotNo": element.StockId,
            "stoneId": element["Report No"],
            "status": element.Status,
            "shape": element.Shape,
            "color": element.Color,
            "clarity": element.Clarity,
            "cut": element.Cut,
            "polish": element.Polish,
            "symmetry": element.Sym,
            "fluorescence": element.Fluor,
            "carat": element.Carat,
            "discountPercent": element.Discount,
            "pricePerCarat": element.PircePerCts,
            "amount": element.Amount,
            "rapRate": element.Rapa,
            "lab": element.Lab,
            "measurement": element.Diameter,
            "totalDepthPercent": element.TotDepth,
            "tablePercent": element.TablePer,
            "shade": element.Shade,
            "milky": element.Milky,
            "eyeClean": element.Natts,
            "keyToSymbols": element.KeyToSymbols,
            "crownHeight": element.CH,
            "crownAngle": element.CA,
            "pavilionHeight": element.PH,
            "pavilionAngle": element.PA,
            "location": element.Location,
            "certificatePath": element.CertPath,
            "image": element.ImagePath,
            "video": element.VideoPath,
            "StoneType" : "Natural"
        };
        if(mappedObj.carat < 0.25 || mappedObj.carat > 25 ){

        }else{

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX" , "ideal" , "good" , "very good" , "excellent"]


            
           
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
    await DiamondModel.deleteMany({"source" : "Rays"})

    axios.get("https://www.raysdiamonds.com/api/stockapi.aspx?uname=B5aCZ1MHk/kFhyrlJxGWuqbL9kX0+Dbdtlzbd4iGSVw=&key=I8zjCR1lj21Ptlo/1Q+yOIHVF0Zmt2qwiOx6oSDH+8Oe3a3Hss9pMr9ODqNOadfS").then(async (fetch)=>{
        const fetchedData = fetch.data;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0])
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
    const fetch = await axios.get("https://www.raysdiamonds.com/api/stockapi.aspx?uname=B5aCZ1MHk/kFhyrlJxGWuqbL9kX0+Dbdtlzbd4iGSVw=&key=I8zjCR1lj21Ptlo/1Q+yOIHVF0Zmt2qwiOx6oSDH+8Oe3a3Hss9pMr9ODqNOadfS");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

