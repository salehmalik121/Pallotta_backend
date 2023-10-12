const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose");
const CPSmapper = require("../functions/CPSmapper");
const Supplier = require("../../Class/Supplier");
const ftp = require("basic-ftp");
const csv = require('csv-parser');

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"]));
        const length = parseInt(element.Measurements.split("-")[0]);
        const width = parseInt(element.Measurements.split("-")[1].split("*")[0]);
        const depth = parseInt(element.Measurements.split("-")[1].split("*")[1]);
        const Ratio = length / width;


        const mappedObj =             {
            _id: id,
            source: "EcoStar",
            lotNo : element["Stock #"],
            stoneId: element["Certificate #"],
            status: element.Availability,
            image: element["Diamond Image"],
            video: element["Diamond Video"],
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.CutGrade,
            polish: element.Polish,
            symmetry: element.Symmetry,
            discountPercent : element["Rap%"],
            fluorescence: element["Fluorescence Intensity"],
            carat: element.Weight,
            pricePerCarat: element["$/Ct"],
            amount: element["Total $"],
            rapRate: element["Rap-Price"],
            lab: element.Lab,
            measurement: element.Measurements,
            totalDepthPercent: element["Depth %"],
            tablePercent: element["Table %"],
            shade: element.Shade,
            eyeClean: "100%", // Just an example; adjust this as needed
            keyToSymbols: element["Key To Symbols"],
            milky: element.Milky,
            crownHeight: element["Crowhn Height"],
            crownAngle: element["Crown Angle"],
            pavilionHeight: element["Pavilion Depth"],
            pavilionAngle: element["Pavilion Angle"],
            location: `${element.City}, ${element.State}, ${element.Country}`,
            length: length, // Adjust this property name as needed
            width: width, // Adjust this property name as needed
            depth: depth, // Adjust this property name as needed
            Inscription: element["Laser Inscription"],
            Ratio: Ratio,
            HeightAboveGirdle: element.HeightAboveGirdle,
            StoneType: element["Stone Type"],
            labReportComment: element["Member Comments"],
            natural: false,
        }

        if(mappedObj.cut === "ID"){
            mappedObj.cut = "I";
        }
        if(mappedObj.cut === "GD"){
            mappedObj.cut = "G";
        }


        mappedObj.shape = mappedObj.shape.toUpperCase();

        const mappedCPS = CPSmapper(mappedObj.cut , mappedObj.polish , mappedObj.symmetry , mappedObj.clarity);
        mappedObj.scut = mappedCPS.cut;
        mappedObj.spolish = mappedCPS.polish;
        mappedObj.ssym = mappedCPS.sym;
        mappedObj.sclarity = mappedCPS.cls;


        if(mappedObj.carat < 0.20 || mappedObj.carat > 30  ){

        }else{

            const AcceptedShape = ["ROUND" , "Round" , "PRINCESS" , "Princess" , "PEAR" , "Pear" , "EMERALD" , "Emerald" , "ASSCHER" , "Asscher" ,"MARQUISE" , "Marquise" , "OVAL" , "Oval" , "CUSHION" , "Cushion" , "HEART" , "Heart" , "RADIANT" , "Radiant"]
            const AcceptedColor = ["D" , "E" , "F" , "H" , "I" , "J"]
            const AcceptedClarity = ["SI1" , "SI2" , "VS2" , "VS1" , "VVS2" , "VVS1" , "IF"]
            const AcceptedCPS = ["E" , "VG" , "G" , "I" , "EXCELLENT" , "VERY GOOD" , "GOOD" , "IDEAL" , "EX"]




            
           
            if (
                AcceptedShape.includes(mappedObj.shape) &&
                AcceptedColor.includes(mappedObj.color) &&
                AcceptedClarity.includes(mappedObj.clarity) &&
                AcceptedCPS.includes(mappedObj.polish) && 
                AcceptedCPS.includes(mappedObj.symmetry)
              ) {
                
                mappedArray.push(mappedObj);
              }
        }
    });
    return mappedArray;
}



exports.MapData = async (req , res)=>{
    // await DiamondModel.deleteMany({"source" : "New Grown"});

    const ftpConfig = {
        host: "ftp.pallotta.co", // Replace with your FTP server address
        user: "NewGrown@pallotta.co",      // Replace with your FTP username
        password: "hw]s.5om)d&",  // Replace with your FTP password
      };

      const client = new ftp.Client();
      
      await client.access(ftpConfig);

      const path = '/AssuntaPalotta.csv';

      const fileStream = await client.downloadTo("/AssuntaPalotta.csv" , "/AssuntaPalotta.csv");
      console.log(fileStream);
      const jsonArray = [];
    
    fileStream.pipe(csv())
      .on('data', (row) => {
        jsonArray.push(row);
      })
      .on('end', () => {
        console.log('CSV parsing complete.');
        res.json(jsonArray);
      });

        // const mappedArray = await SchemaMapping(fetchedData);
        // console.log(mappedArray[0]);
        // DiamondModel.insertMany(mappedArray).then(()=>{
        //     const SupplierUp = new Supplier("New Grown");
        //     SupplierUp.SyncCommission();
        //     res.sendStatus(200);
        // }).catch(err=>{
        //     console.log(err);
        //     res.status(500).json(err);
        // })


}


exports.fetchJeniData = async ()=>{
    const fetch = await axios.get("https://api.ecostar.diamonds:9921/api/v1/StockShare?userid=Pallotta&token=AYDL-2UA0-533B-URPZ-GN4X-VVPY-0TEL");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

