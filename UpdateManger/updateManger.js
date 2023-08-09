const DiamondModel = require("../DB/Schema/DiamondSchema");

exports.updateManger = async (NewData , source) => {
    

    await DiamondModel.deleteMany({"source" : source}).then(()=>{
        console.log("old data Deleted from " + source + " DB")
    });
    await DiamondModel.create(NewData).then(()=>{
        console.log("data updated to " + source + " DB")
    });
    

}