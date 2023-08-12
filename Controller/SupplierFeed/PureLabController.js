const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")


    const SchemaMapping = async (fetchedData) => {
        const mappedArray = [];
    
        await fetchedData.forEach(element => {
            const id = new mongoose.Types.ObjectId(parseInt(element["Certificate #"])); // Generating a new ObjectId for each element.
    
            mappedArray.push({
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
                discountPercent: element["% Off RAP"],
                pricePerCarat: element["Price/Ct"],
                amount: element["Rapaport Price"],
                lab: element.Lab,
                measurement: `${element.Length} x ${element.Width} x ${element.Depth}`,
                totalDepthPercent: element["Depth %"],
                tablePercent: element["Table %"],
                inscription: element["Inscription #"],
                diamondImage: element["Diamond Image"],
                video: element.Video,
                StoneType: "Lab Created",
                natural : false,
            });
        });
    
        return mappedArray;
    }




exports.MapData =  async (req , res)=>{
    await DiamondModel.deleteMany({"source" : "PureLab"});
    console.log("deleted");

    axios.get("http://api.pld.live/stockshare/CXVZ1-YXDRT-MAVQD-A6468").then(async (fetch)=>{
        const fetchedData = fetch.data;
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
    const fetch = await axios.get("http://api.pld.live/stockshare/CXVZ1-YXDRT-MAVQD-A6468");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

