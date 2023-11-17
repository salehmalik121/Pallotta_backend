const DiamondModel = require("../../DB/Schema/DiamondSchema");

exports.addSingleDiamond = async (req , res) =>{
    const body = req.body;
    body.source = "Pallotta"
    body.natural = req.params.natural === "true";
    body.colored = req.params.colored === "true";
    DiamondModel.create({body}).then(()=>{
        res.status(200).json({"message" : "Saved New Diamond."})
    }).catch((e)=>{
        res.status(500).json({"message" : "some error Occurred Diamond Didn't saved."})
    })

}