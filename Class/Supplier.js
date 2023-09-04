const Commission = require("../DB/Schema/comissionSchema");

class Supplier{
    constructor(supplierName){
        this.Supplier = supplierName;
    }

    SyncCommission = async()=>{
        const AppliedCommissions = await Commission.find();
        AppliedCommissions.forEach(async(element)=>{
            const query = element.FilterQuery;
            const data = await Diamonds.find({...query , "source" : this.Supplier});
            data.forEach((diamond=>{
                
            }))
            
        })
    }

}