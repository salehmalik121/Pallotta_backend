const express = require("express");
const Commission = require("../../DB/Schema/comissionSchema");
const bodyParser = require("body-parser");
const Diamonds = require("../../DB/Schema/DiamondSchema");

const Router = express.Router();

Router.post("/" , bodyParser.json() , async (req , res , next)=>{
    const body = req.body;
    body.CommissionPer = body.commissionValue;
    
        
    
        body.Natural = body.FilterQuery.natural;

        await Commission.findOneAndDelete({"FilterQuery" : body.FilterQuery});

        await Commission.create(body).then(()=>{
            console.log("saved");
        }).catch(err=>{
            console.log(err);
        });

        
    
    
        const filterQuery = body.FilterQuery;
        const commissionValue = body.commissionValue;
        
        try {
          // Find all diamonds matching the filter query
          const count =  await Diamonds.countDocuments(filterQuery);
          console.log("Hello")
          
          // Execute the bulk update operation in a single request
          const b = 50;
          for(let i=0 ; i<count ; i += b){


            const filteredData = await Diamonds.find(filterQuery).skip(i).limit(50);

            const bulkUpdateOperations = filteredData.map((element) => ({
                updateOne: {
                  filter: { _id: element._id },
                  update: {
                    $set: {
                      RetailPrice: Math.round(
                        (element.amount + (commissionValue * element.amount) / 100) / 5
                      ) * 5,
                      CommissionPer: commissionValue,
                    },
                  },
                },
              }));
            
            Diamonds.bulkWrite(bulkUpdateOperations).then(()=>{
                if(i===0){
                console.log("saved");
                res.status(200).json({});}
            })
          }
        
        } catch (err) {
          console.error(err);
        }



})


Router.get("/" , async(req  ,res, next)=>{
    const filter = {}
    if(filter.Natural){
        filter.Natural = req.query.natural;
    }
  
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