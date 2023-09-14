const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")
const CPSmapper = require("../functions/CPSmapper");
const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.CERTIFICATE_NO));

        const mappedObj = {
            _id: id,
            "source": "Anjali",
            "lotNo": element.StoneNo,
            "stoneId": element.ReportNo,
            "status": element.LabGrown === "YES" ? "Lab" : "Natural", // Define status based on LabGrown field
            "image": "", // You can add image path if available
            "video": element.VideoLink,
            "shape": element.ShapeName,
            "color": element.ColorName,
            "clarity": element.ClarityName,
            "cut": element.Cut,
            "polish": element.Pol,
            "symmetry": element.Sym,
            "fluorescence": element.Fls,
            "carat": element.Weight,
            "discountPercent": element.Discount,
            "pricePerCarat": element.NetRate,
            "amount": element.PreValue,
            "rapRate": element.Rap,
            "lab": element.Lab,
            "measurement": element.Measurements,
            "totalDepthPercent": element.DepthPer,
            "tablePercent": element.TablePer,
            "crownHeight": element.CH,
            "crownAngle": element.CA,
            "pavilionHeight": element.PH,
            "pavilionAngle": element.PA,
            "location": element.Location,
            "purity": element.ClarityName, // Add purity data if available
            "length": element.Length,
            "width": element.Width,
            "depth": element.Depth,
            "Ratio": element.Ratio,
            "StoneType": element.LabGrown === "YES" ? "Lab Grown" : "Natural", // Define StoneType based on Type field
            "natural": element.LabGrown === "YES" ? false : true,  // Set natural flag based on LabGrown field
        }


        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;

        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.20 || mappedObj.carat > 30  ){

        }else{




        

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J" , "G"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX"]


            
           
            if (
              AcceptedShape.includes(mappedObj.shape) &&
              AcceptedColor.includes(mappedObj.color) &&
              AcceptedClarity.includes(mappedObj.clarity)
            ) {
              mappedArray.push(mappedObj);
            }else{
              if(AcceptedShape.includes(mappedObj.shape) &&
              AcceptedClarity.includes(mappedObj.clarity)){
                  mappedObj.source = "Anjali Colored"
                  mappedObj.colored = true
                  mappedArray.push(mappedObj);
              }
            }
        }
 
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "Anjali"});
    await DiamondModel.deleteMany({"source" : "Anjali Colored"});
    var data = JSON.stringify({
      "Shapes": [],
      "Colors": [],
      "Claritys": [],
      "Syms": [],
      "Pols": [],
      "Locations": [],
      "Labs": [],
      "Flss": [],
      "FancyColors": [],
      "Cuts": []
    });
      
      var config = {
        method: 'post',
        url: 'http://anjalidiamonds.net/api/DiamondList/GetData_For_AllDiamondList',
        headers: { 
          'Authorization': 'Basic YW5qYWxpOmFuamFsaUA5ODkz', 
          'Content-Type': 'application/json'
        },
        data : data
      };

    axios(config).then(async (fetch)=>{
        const fetchedData = fetch.data;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.insertMany(mappedArray);
        res.status(200);
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })



}


// exports.fetchJeniData = async ()=>{
//     const fetch = await axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock");
//     const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

//     return mappedArray;
// }

