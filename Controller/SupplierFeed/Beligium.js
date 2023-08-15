const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const certNo = element.CertificateLink;
        const regex = /\/(\d+)\.pdf$/;
        const match = certNo.match(regex);
        let certNumber;
        if (match && match[1]) {
             certNumber = match[1];
        }

        const pricePerCaret = element.Buy_Price / element.Weight;

        const length = element.Measurements.split("X")[0];
        const width = element.Measurements.split("X")[1];
        const depth = element.Measurements.split("X")[2];

        const id = new mongoose.Types.ObjectId(parseInt(certNumber));
        mappedArray.push({
            _id: id,
            source: "Belgium",
            lotNo: element.Stock_No,
            stoneId: certNumber,
            status: element.Availability,
            image: element.ImageLink,
            video: element.VideoLink,
            shape: element.Shape,
            color: element.Color,
            clarity: element.Clarity,
            cut: element.Cut_Grade,
            polish: element.Polish,
            symmetry: element.Symmetry,
            fluorescence: element.Fluorescence_Intensity,
            carat: parseFloat(element.Weight),
            discountPercent: element.Buy_Price_Discount_PER, // Set default discount percent if not provided in JSON
            pricePerCarat: pricePerCaret, // Set default price per carat if not provided in JSON
            amount: element.Buy_Price, // Set default amount if not provided in JSON
            rapRate: parseFloat(element.Rap_Price),
            lab: element.Lab,
            measurement: element.Measurements,
            totalDepthPercent: parseFloat(element.DEPTH_PER),
            tablePercent: parseFloat(element.TABLE_PER),
            shade: element.Shade,
            eyeClean: element.Eye_Clean,
            keyToSymbols: element.Key_To_Symbols,
            milky: element.Milky,
            crownHeight: 0 ,
            crownAngle: 0,
            pavilionHeight: 0,
            pavilionAngle: 0,
            location: element.Country + ', ' + element.State + ', ' + element.City,
            purity: element.Country_Of_Origin,
            length: length,
            width: width,
            depth: depth,
            Inscription: element.Gemprint_ID,
            Ratio: element.Ratio,
            HeightAboveGirdle: element.HEIGHT_ABOVE,
            StoneType: element.Diamond_Type,
            natural: element.Diamond_Type === "Natural Diamond"
        })
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "Belgium"})

    axios.get("https://belgiumdia.com/api/DeveloperAPI?APIKEY=727463ab757f49ef2461d52f9565d4f025b2d3d7e79d").then(async (fetch)=>{
        const fetchedData = fetch.data.Stock;
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
    const fetch = await axios.get("https://belgiumdia.com/api/DeveloperAPI?APIKEY=727463ab757f49ef2461d52f9565d4f025b2d3d7e79d");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

