const mongoose = require('mongoose');

const deletedDiamonds = new mongoose.Schema({

    stoneId : String

});

const DeletedDiamonds = mongoose.model('DeletedDiamonds', deletedDiamonds);

module.exports = DeletedDiamonds;