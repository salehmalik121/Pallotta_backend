const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const aadata = require("../../aa.json");
const { parseNumbers } = require("xml2js/lib/processors");
const CPSmapper = require("../functions/CPSmapper");

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {

        const id = new mongoose.Types.ObjectId(parseInt(element.ItemDetails.Certificate_No));

        const mappedObj = {
            "source": "Eco Grown",
            "lotNo": element.ItemDetails.Certificate_No,
            "stoneId": element.ItemDetails.Certificate_No,
            "status": "In Stock", // You can set a default status or leave it as per your requirements.
            "image": element.ItemDetails.Image_URL,
            "video": element.ItemDetails.Video_URL,
            "shape": element.ItemDetails.Shape,
            "color": element.ItemDetails.Color,
            "clarity": element.ItemDetails.Clarity,
            "cut": element.ItemDetails["Cut Grade"],
            "polish": element.ItemDetails.Polish,
            "symmetry": element.ItemDetails.Symmetry,
            "fluorescence": element.ItemDetails.Fluor,
            "carat": parseFloat(element.ItemDetails.Weight), // Assuming Weight is in carats and needs to be converted to a number.
            "discountPercent": parseFloat(element.ItemDetails["Rap%"]) * -1, // Default discount percentage
            "pricePerCarat": parseFloat(element.ItemDetails.Price_per_Carat), // Assuming Price_per_Carat is a number.
            "amount": parseFloat(element.ItemDetails.Price_per_Carat) * parseFloat(element.ItemDetails.Weight)  , // Assuming Rapaport Price is a number.
            "rapRate": parseFloat(element.ItemDetails["Rap%"]), // Assuming Rap% is a number.
            "lab": element.ItemDetails.Lab,
            "measurement": element.ItemDetails.Measurement,
            "totalDepthPercent": parseFloat(element.ItemDetails["Depth%"]), // Assuming Depth% is a number.
            "tablePercent": parseFloat(element.ItemDetails["Table%"]), // Assuming Table% is a number.
            "location": element.ItemDetails.Origin,
            "purity": element.ItemDetails.Clarity,
            "length": element.ItemDetails.Length,
            "width": element.ItemDetails.Width,
            "depth": element.ItemDetails.Depth,
            "StoneType": "Lab",
            "natural": false 
        };



        if( mappedObj.carat < 0.20 || mappedObj.carat > 30 ){

        }else{


           

            if(mappedObj.cut === "Excellent"){
                mappedObj.cut = "EX"
            }

            if(mappedObj.cut === "Very Good"){
                mappedObj.cut = "VG"
            }

            if(mappedObj.cut === "Good"){
                mappedObj.cut = "G"
            }

            
            if(mappedObj.cut === "Ideal"){
                mappedObj.cut = "I"
            }
            if(mappedObj.polish === "Excellent"){
                mappedObj.polish = "EX"
            }

            if(mappedObj.polish === "Very Good"){
                mappedObj.polish = "VG"
            }

            if(mappedObj.polish === "Good"){
                mappedObj.polish = "G"
            }

            
            if(mappedObj.polish === "Ideal"){
                mappedObj.polish = "I"
            }
            if(mappedObj.symmetry === "Excellent"){
                mappedObj.symmetry = "EX"
            }

            if(mappedObj.symmetry === "Very Good"){
                mappedObj.symmetry = "VG"
            }

            if(mappedObj.symmetry === "Good"){
                mappedObj.symmetry = "G"
            }

            
            if(mappedObj.symmetry === "Ideal"){
                mappedObj.symmetry = "I"
            }
            const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
            mappedObj.scut = mappedCPS.cut;
            mappedObj.spolish = mappedCPS.polish;
            mappedObj.ssym = mappedCPS.sym;
            mappedObj.sclarity = mappedCPS.cls;
            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "G" , "H" , "I" , "J"]
            const AcceptedClarity = ["SI1", "si1" , "SI2" , "si2" , "VS2", "vs2" , "VS1", "vs1" , "VVS2" , "vvs2" , "VVS1" , "vvs1" , "IF" , "if" , "fl" ]
            const AcceptedCPS = ["E" , "VG" , "G" , "GD" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX" , "excellent" , "very good" , "good" , "ideal"]


            
           
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
    await DiamondModel.deleteMany({"source" : "Eco Grown"});
    console.log("Deleted");
    let AuthToken;
    var data = JSON.stringify({
        "username": "PALLOTTA_J",
        "password": "P@LL0TT@_J"
      });
      
      var configAuth = {
        method: 'post',
        url: 'http://54.204.220.158:3033/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      
      await axios(configAuth)
      .then(function (response) {
        AuthToken = response.data.access_token
      })
      .catch(function (error) {
        console.log(error);
      });


      console.log(AuthToken);

      var config = {
        method: 'get',
        url: 'http://54.204.220.158:3033/inventory?customer_id=849',
        headers: { 
          'Authorization': `Bearer ${AuthToken}`
        },
        maxContentLength: 2000000000000, 
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

//TODO: create function to merge all pages and get data
exports.fetchJeniData = async ()=>{
    const fetch = await axios.get("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

