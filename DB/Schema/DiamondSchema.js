const mongoose = require('mongoose');

const diamondSchema = new mongoose.Schema({
    _id : mongoose.Schema.ObjectId,
    source: String,
  lotNo: String,
  stoneId: {
    type : String,
    unique : true
  },
  status: String,
  image: String,
  video: String,
  shape: String,
  color: String,
  clarity: String,
  cut: String,
  polish: String,
  symmetry: String,
  fluorescence: String,
  carat: Number,
  discountPercent:  {
    type : Number,
    default : 0
  },
  pricePerCarat: Number,
  amount: Number,
  rapRate: Number,
  lab: String,
  measurement: String,
  totalDepthPercent: Number,
  tablePercent: Number,
  shade: String,
  eyeClean: String,
  keyToSymbols: String,
  brown: {
    type : String,
    default : " "
  },
  milky: String,
  tabBlack: {
    type : String,
    default : " "
  },
  centerInc: String,
  sideBlack: String,
  girdle: String,
  girdlePercent: Number,
  crownHeight: Number,
  crownAngle: Number,
  pavilionHeight: Number,
  pavilionAngle: Number,
  luster: String,
  culet: String,
  comments: String,
  location: String,
  uploadDate: Date,
  certificatePath: String,
  reportNo: String,
  packetNo: String,
  purity: String,
  length: String,
  width: String,
  depth: String,
  Inscription : String,
  Ratio : String ,
  HeightAboveGirdle : String ,
  StoneType: {
    type : String,
    required : true
  },
  labReportComment : {
    type: String , 
  } , 
  natural : {
    type : Boolean
  },
  CommissionPer : {
    type : Number
  }
});

const Diamond = mongoose.model('Diamond', diamondSchema);

module.exports = Diamond;