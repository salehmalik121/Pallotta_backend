const express = require("express");
const Commission = require("../../DB/Schema/comissionSchema");
const bodyParser = require("body-parser");
const Diamonds = require("../../DB/Schema/DiamondSchema");

const Router = express.Router();

const batchLimit = 500; // Adjust this batch size as needed


async function detectConflicts(newDocument) {
  const storedDocuments = await Commission.find({}); // Fetch all stored documents

  const conflicts = [];

  for (const storedDoc of storedDocuments) {
    const conflict = findConflicts(storedDoc.toObject(), newDocument);
    if (Object.keys(conflict).length > 0) {
      conflicts.push({ storedDoc, conflict });
    }
  }

  return conflicts;
}

// Function to compare two objects and find conflicts
function findConflicts(doc1, doc2) {

  const conflicts = {};

  for (const key in doc1) {
    if (doc1.hasOwnProperty(key) && doc2.hasOwnProperty(key)) {
      
      if(doc1.FilterQuery.natural === doc2.FilterQuery.natural && doc1.FilterQuery.colored === doc2.FilterQuery.colored  ){
      if (doc1[key] !== doc2[key]) {
        conflicts[key] = [doc1[key], doc2[key]];
      }
    }
    }
  }
  
  return [];
}

Router.post("/", bodyParser.json(), async (req, res, next) => {
  const body = req.body;
  body.CommissionPer = body.commissionValue;
  body.Natural = body.FilterQuery.natural;
  body.Colored = body.FilterQuery.colored;

  const filterQuery = body.FilterQuery;
  const commissionValue = body.commissionValue;


  detectConflicts(body).then(



    

    async (conflicts) =>{
      if(conflicts.length > 0){
        res.status(201).json({"err" : "Conflict with stored Commission" , conflicts})
      }else{
        try {
          // Find all diamonds matching the filter query and get a cursor
          const cursor = Diamonds.find(filterQuery).lean().cursor();
      
          let isFirstBatchSaved = false;
          let bulkUpdateOperations = [];
      
          for await (const doc of cursor) {
            bulkUpdateOperations.push({
              updateOne: {
                filter: { _id: doc._id },
                update: {
                  $set: {
                    RetailPrice: Math.round((doc.amount + (commissionValue * doc.amount) / 100) / 5) * 5,
                    CommissionPer: commissionValue,
                  },
                },
              },
            });
      
            if (bulkUpdateOperations.length >= batchLimit) {
              // Execute bulk write operation when batch size is reached
              await Diamonds.bulkWrite(bulkUpdateOperations);
              bulkUpdateOperations = [];
      
              if (!isFirstBatchSaved) {
                console.log("First batch saved");
                isFirstBatchSaved = true;
              }
            }
          }
      
          if (bulkUpdateOperations.length > 0) {
            // Execute any remaining bulk updates
            await Diamonds.bulkWrite(bulkUpdateOperations);
          }
      
          // Delete documents matching the filter query
          await Commission.deleteMany({ FilterQuery: filterQuery }).then(found=>{
            console.log(found);
          });
      
          // Create a new Commission document
          await Commission.create(body);
      
          res.status(200).json({ message: "All batches saved" });
          console.log("Saved");
      
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
        }
      }
    }

  )


});





Router.get("/" , async(req  ,res, next)=>{
    const filter = {}
    const params = req.query;
    console.log(params);
    if(params.natural === "true" || params.natural === "false"){
      filter.Natural = params.natural === "true"
    }

    if(params.colored === "true" || params.colored === "false"){
      filter.Colored = params.colored === "true"
    }


    if(params.stoneType === "lab"){
      filter.Natural = false;
      filter.Colored = false
    } else if(params.stoneType === "natural"){
      filter.Natural = true;
      filter.Colored = false
    }else if(params.stoneType === "lab colored"){
      filter.Natural = false;
      filter.Colored = true
    }else if(params.stoneType === "natural colored"){
      filter.Natural = true;
      filter.Colored = true
    }

    console.log(filter);


  
    const data = await Commission.find(filter);
    res.status(200).json(data)
})



Router.patch("/" ,bodyParser.json(), async(req , res, next)=>{

    console.log(req.body);
    const newData = req.body;

    const comId = newData.comId;

    await Commission.updateOne({"_id" : comId} , {"CommissionPer" : newData.NewCom});

    const savedData = await Commission.findById(comId);

    const filteredData = await Diamonds.find(savedData.FilterQuery);

    console.log(filteredData.CommissionPer);

     filteredData.forEach(async(element) => {
        const retailPrice = element.amount + (savedData.CommissionPer *  element.amount) /100 ;
        const roundAmount = Math.round(retailPrice/5)*5
        console.log("value " + roundAmount )
        Diamonds.updateOne({"_id" : element._id} , {
            "RetailPrice" : roundAmount,
            "CommissionPer" : savedData.CommissionPer
        }).then(found=>{
            console.log(found)
        }).catch(err=>{
            console.log(err);
        })
    });


    console.log("saved");
    res.status(200).json({});

    

})



Router.delete("/:id" , async(req,res , next)=>{
    const id = req.params.id;
    const CommissionSaved = await Commission.findOne({"_id" : id});
    const filteredData = await Diamonds.find(CommissionSaved.FilterQuery);
    console.log(CommissionSaved.FilterQuery);
// Prepare the update operations for all documents

    filteredData.map(async (element) => {
        Diamonds.findByIdAndUpdate(element._id , {
            "CommissionPer" : 0,
            "RetailPrice" : 0
        }).then(up=>{

        }).catch(err=>{
            console.log(err);
        })
    })




await Commission.findByIdAndDelete(id);



res.sendStatus(200);
} )


module.exports = Router