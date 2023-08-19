const axios = require("axios");
const DiamondModel = require("../../DB/Schema/DiamondSchema");
const mongoose = require("mongoose")

const SchemaMapping = async (fetchedData)=>{
    const mappedArray = [];
    await fetchedData.forEach(element => {
        const id = new mongoose.Types.ObjectId(parseInt(element.cert_num));

        const mappedObj = {
            _id: id,
            source: "RRajesh",
            lotNo: element.stock_num,
            stoneId: element.cert_num,
            status: element.availability,
            image: element.image_url,
            video: element.video_url,
            shape: element.shape,
            color: element.color,
            clarity: element.clarity,
            cut: element.cut,
            polish: element.polish,
            symmetry: element.symmetry,
            fluorescence: element.fluor_intensity,
            carat: element.size,
            discountPercent: element.discount_percent,
            pricePerCarat: element.price_per_carat,
            amount: element.total_sales_price,
            lab: element.lab,
            measurement: element.measurement,
            totalDepthPercent: element.depth_percent,
            tablePercent: element.table_percent,
            shade: element.shade,
            eyeClean: element.eye_clean,
            brown: "",
            milky: element.milky,
            tabBlack: "",
            centerInc: element.inclusion_center,
            sideBlack: element.inclusion_black,
            girdle: element.Girdle,
            crownHeight: element.crown_height,
            crownAngle: element.crown_angle,
            pavilionHeight: element.pavilion_depth, // pavilion_depth corresponds to pavilion height
            pavilionAngle: element.pavilion_angle,
            culet: element.culet_size,
            comments: element.comments,

            certificatePath: element.cert_url,
            reportNo: element.cert_num,

            length: element.meas_length.toString(),
            width: element.meas_width.toString(),
            depth: element.meas_depth.toString(),
            Inscription: element.laser_inscription,
            Ratio: element.ratio ? element.ratio.toString() : "",
            StoneType: "Natural",
            labReportComment: element.cert_comment,
            natural: true, // Assuming that "Natural_Type" is not provided and all stones are natural
            CommissionPer: 0, // Not provided in the data
            RetailPrice: -1 // Default value as per the schema
        }
        
        if(mappedObj.stoneId===" " || mappedObj.stoneId==="" || mappedObj.carat < 0.25 || mappedObj.carat > 25){
            
        }else{
            mappedArray.push(mappedObj);
        }
        
    });
    return mappedArray;
}



exports.MapData =  async(req , res)=>{
    await DiamondModel.deleteMany({"source" : "RRajesh"})

    axios.post("https://u24351668.ct.sendgrid.net/ls/click?upn=qH0TWbaR1eNxpDR2sD-2FP6qZOfjKwhRjEPzY8Q-2F0j-2BQrzRM4qCIcPyXJIDkBGhzfw9sawg36JV226HFVuVWkzu3vZmna1Rp0FwNAhPBkA-2F5yy7BfSTihHZT6qpRRqH5DAM0vGfUU12OBQ7PYl0Jx6xqEjnK4SgnqKUWYgdHVdw0k-3DFnJZ_oVTZGrLHzFJ1HcdJu4aha-2BylV313pXWBijMydw4QGuwWtXv4nwnOriYTDDQeiwnNBpAAgOlaBZgdDJSB9Jws3kvCmPZ7Z2WCc9Ye4LelqoZIAUja6i-2FdI1hzpdiZIG5GlJHlSsDyAEUErLtuFbBvqGyrRCBqq34wLXph1iiDg3syE3mKHro8iEWoWG8u5ll7CJlNorYOSqUMvZB0jJ9vK0lnqosjeOosu7YndUQN-2FEk-3D").then(async (fetch)=>{
        const fetchedData = fetch.data.list;
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
    const fetch = await axios.post("https://u24351668.ct.sendgrid.net/ls/click?upn=qH0TWbaR1eNxpDR2sD-2FP6qZOfjKwhRjEPzY8Q-2F0j-2BQrzRM4qCIcPyXJIDkBGhzfw9sawg36JV226HFVuVWkzu3vZmna1Rp0FwNAhPBkA-2F5yy7BfSTihHZT6qpRRqH5DAM0vGfUU12OBQ7PYl0Jx6xqEjnK4SgnqKUWYgdHVdw0k-3DFnJZ_oVTZGrLHzFJ1HcdJu4aha-2BylV313pXWBijMydw4QGuwWtXv4nwnOriYTDDQeiwnNBpAAgOlaBZgdDJSB9Jws3kvCmPZ7Z2WCc9Ye4LelqoZIAUja6i-2FdI1hzpdiZIG5GlJHlSsDyAEUErLtuFbBvqGyrRCBqq34wLXph1iiDg3syE3mKHro8iEWoWG8u5ll7CJlNorYOSqUMvZB0jJ9vK0lnqosjeOosu7YndUQN-2FEk-3D");
    const mappedArray = await SchemaMapping(fetch.data.GetStockResult.Data)

    return mappedArray;
}

