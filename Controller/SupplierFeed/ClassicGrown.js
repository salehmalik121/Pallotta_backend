const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.CERTIFICATE_NO));

        const mappedObj = {
            _id: id,
            source: "ClassicGrown",
            lotNo: element.LOAT_NO,
            stoneId: element.CERTIFICATE_NO, // Converting to string as per the schema
            status: element.STATUS,
            image: element.IMAGE === "Click Here" ? "" : element.IMAGE,
            video: element.VIDEO === "Click Here" ? "" : element.VIDEO,
            shape: element.SHAPE,
            color: element.COLOR,
            clarity: element.CLARITY,
            cut: element.CUT,
            polish: element.POLISH,
            symmetry: element.SYMM,
            fluorescence: element.FLURO,
            carat: element.CARAT,
            discountPercent: element.DISCOUNT,
            pricePerCarat: element.PRICE_PER_CTS,
            amount: element.AMOUNT,
            rapRate: element.RAP,
            lab: element.LAB,
            measurement: element.MEASUREMENTS,
            totalDepthPercent: parseFloat(element.DEPTH_PER),
            tablePercent: parseFloat(element.TABLE_PER),

            milky: "", // You can add this field according to your needs
            tabBlack: element.BLACK,
            centerInc: element.CUTLET,
            sideBlack: "", // You can add this field according to your needs
            girdle: element.GRIDLE,

            location: element.COUNTRY,
            certificatePath: element.CERTIFICATE,
            reportNo: element.CERTIFICATE_NO,
            length: element.LENGTH,
            width: element.WIDTH,
            depth: element.DEPTH,
            Ratio: element.LENGTH/element.WIDTH, // You can add this field according to your needs
            StoneType: "Lab grown",
            labReportComment: "", // You can add this field according to your needs
            natural: false,

        }

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
              }else{
                if(AcceptedShape.includes(mappedObj.shape) &&
                AcceptedClarity.includes(mappedObj.clarity) &&
                AcceptedCPS.includes(mappedObj.cut) && 
                AcceptedCPS.includes(mappedObj.polish) && 
                AcceptedCPS.includes(mappedObj.symmetry)){
                    mappedObj.source = "Classic Grown Colored"
                    mappedArray.push(mappedObj);
                }
              }
        }
 
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "ClassicGrown"});
    for(let i =0 ; i<5 ; i++){
    var data = JSON.stringify({
        "action": "diamond_stock_list",
        "email": "info@pallottajewellers.com",
        "password": "276442530",
        "startindex": i*3000,
        "shape": "",
        "carat ": "",
        "color": "",
        "clarity": "",
        "cut": "",
        "polish": "",
        "symm": "",
        "lab": "",
        "loatno": "",
        "certificate_no": "",
        "diamond_width_from": "",
        "diamond_width_to": "",
        "diamond_length_from": "",
        "diamond_length_to": "",
        "table_from": "",
        "table_to": "",
        "total_depth_from": "",
        "total_depth_to": "",
        "depth_per_from": "",
        "depth_per_to": "",
        "pav_angle_from": "",
        "pav_angle_to": "",
        "pavilion_depth_from": "",
        "pavilion_depth_to": "",
        "crown_height_from": "",
        "crown_height_to": "",
        "crown_angle_from": "",
        "crown_angle_to": "",
        "key_symbols": "",
        "heart_and_arrow": "",
        "eye_clean": "",
        "discount_from": "",
        "discount_to": ""
      });
      var config = {
        method: 'post',
        url: 'https://www.classicgrowndiamonds.com/API/action.php',
        headers: { 
          'Content-Type': 'application/json', 
          'Cookie': 'ci_session=45pq3uvjf99gdn10qvj82hkkjog6koo9'
        },
        data : data
      };

    axios(config).then(async (fetch)=>{
        if(fetch.data.CODE == "0"){
            return;
        }
        const fetchedData = fetch.data.DATA;
        const mappedArray = await SchemaMapping(fetchedData);
        console.log(mappedArray[0]);
        DiamondModel.create(mappedArray);

    }).catch((err)=>{
        console.log(err);
    })
}

res.status(200);
}


exports.fetchJeniData = async ()=>{
    const fetch = await axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

