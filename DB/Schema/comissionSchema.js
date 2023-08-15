const mongoose = require('mongoose');

const CommissionSchema = new mongoose.Schema({
    

    SelectedShapeArr : {
        type : Array,
        default : [
            "Round",
            "Princess",
            "Cushion",
            "Emerald",
            "Asscher",
            "Marquise",
            "Oval",
            "Pear",
            "Heart",
            "Radiant",
          ]
    },
    SelectedColorArr : {
        type : Array,
        default : ["D", "E", "F", "G", "H", "I", "J",]
    },
    SelectedCelerityArr : {
        type : Array,
        default :["IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2"]
    },
    MinSize : Number,
    MaxSize : Number,
    Natural: Boolean,
    StockNumber : String,
    LabCert : String,

    FilterQuery : {
        type : Object
    },
    CommissionPer : {
        type : Number
    }
});

const Commission = mongoose.model('Commission', CommissionSchema);

module.exports = Commission;