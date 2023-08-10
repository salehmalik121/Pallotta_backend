const express = require("express");
const jeniController = require("../../Controller/SupplierFeed/jeniController");
const BrahmaController = require("../../Controller/SupplierFeed/BrahmaController");
const PureLab = require("../../Controller/SupplierFeed/PureLabController");
const LightGrown = require("../../Controller/SupplierFeed/LightGrownController");

const Router = express.Router();

Router.get("/Jeni" , jeniController.MapData);
Router.get("/Brahma" , BrahmaController.MapData);
Router.get("/pureLab" , PureLab.MapData);
Router.get("/LightGrown" , LightGrown.MapData);

module.exports = Router