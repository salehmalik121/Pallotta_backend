const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.REPORT_NO));
        mappedArray.push({
            _id : id,
            "source" : "Ossam",
            "lotNo" : element.PACKET_NO,
            "stoneId" : element.REPORT_NO,
            "status" : element.STONE_STATUS,
            "image" : element.IMAGE_LINK,
            "video" : element.VIDEO_LINK,
            "shape" : element.SHAPE,
            "color" : element.COLOR,
            "clarity" : element.PURITY,
            "cut" : element.CUT,
            "polish" : element.POLISH,
            "symmetry" : element.SYMM,
            "fluorescence" : element.FLS,
            "carat" : element.CTS,
            "discountPercent" : element.DISC_PER,
            "pricePerCarat" : element.NET_RATE,
            "amount" : element.NET_VALUE,
            "rapRate" : element.RATE,
            "lab" : element.LAB,
            "measurement" : element.LWD,
            "totalDepthPercent" : element.DEPTH_PER,
            "tablePercent" : element.TABLE_PER,
            "shade" : element.SHADE,
            "eyeClean" : element.EYE_CLEAN,
            "keyToSymbols" : element.KEY_TO_SYMBOLS,
            "milky" : element.MILKY,
            "crownHeight" : element.CROWN_HEIGHT,
            "crownAngle" : element.CROWN_ANGLE,
            "pavilionHeight" : element.PAV_HEIGHT,
            "pavilionAngle" : element.PAV_ANGLE,
            "location" : element.LOCATION,
            "purity" : element.PURITY,
            "length" : element.LENGTH_1,
            "width" : element.WIDTH,
            "depth" : element.DEPTH,
            "Inscription" : element.INSCRIPTION,
            "Ratio" : element.RATIO,
            "HeightAboveGirdle" : element.HeightAboveGirdle,
            "StoneType" : "Natural",
            "natural" : true

        })
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "Ossam"})

    axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock").then(async (fetch)=>{
        const fetchedData = fetch.data.GetStockResult.Data;
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
    const fetch = await axios.post("http://3.110.23.80/OsamProvideStock.svc/GetStock");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

