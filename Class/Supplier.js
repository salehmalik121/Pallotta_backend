const Commission = require("../DB/Schema/comissionSchema");
const Diamonds = require("../DB/Schema/DiamondSchema");


class Supplier{
    constructor(supplierName){
        this.Supplier = supplierName;
    }


    SyncCommission = async () => {
        const batchSize = 100;
        const AppliedCommissions = await Commission.find();
        const bulkUpdateOperations = [];
    
        try {
            await Promise.all(AppliedCommissions.map(async (element) => {
                const query = element.FilterQuery;
                const percent = element.CommissionPer;
    
                const cursor = Diamonds.find({ ...query, "source": this.Supplier }).lean().cursor();
    
                for await (const diamond of cursor) {
                    const cost = parseInt(diamond.amount) + parseInt(diamond.amount * (percent / 100));
                    diamond.CommissionPer = percent;
                    diamond.RetailPrice = cost;
                    console.log(cost);
                    bulkUpdateOperations.push({
                        updateOne: {
                            filter: { _id: diamond._id },
                            update: { $set: { CommissionPer: percent, RetailPrice: cost } }
                        }
                    });
    
                    if (bulkUpdateOperations.length >= batchSize) {
                        await Diamonds.bulkWrite(bulkUpdateOperations);
                        bulkUpdateOperations.length = 0; // Clear the array
                    }
                }
            }));
    
            if (bulkUpdateOperations.length > 0) {
                await Diamonds.bulkWrite(bulkUpdateOperations);
                console.log('Synced Commissions successfully.');
            } else {
                console.log('No data to update.');
            }
        } catch (error) {
            console.error('Error syncing commissions:', error);
        }
    };
    
    
    

}


module.exports = Supplier