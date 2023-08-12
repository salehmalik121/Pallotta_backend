const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"]));
        const length = parseInt(element.Measurements.split("-")[0]);
        const width = parseInt(element.Measurements.split("-")[1].split("*")[0]);
        const depth = parseInt(element.Measurements.split("-")[1].split("*")[1]);
        const Ratio = length / width;
        mappedArray.push(
            {
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
        )
    });
    return mappedArray;
}



exports.MapData = async (req , res)=>{
    axios.get("https://api.ecostar.diamonds:9921/api/v1/StockShare?userid=Pallotta&token=AYDL-2UA0-533B-URPZ-GN4X-VVPY-0TEL").then(async (fetch)=>{
        const fetchedData = fetch.data.data;
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
    const fetch = await axios.get("https://api.ecostar.diamonds:9921/api/v1/StockShare?userid=Pallotta&token=AYDL-2UA0-533B-URPZ-GN4X-VVPY-0TEL");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

