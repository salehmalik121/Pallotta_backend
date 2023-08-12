const express = require("express");
const jeniController = require("../../Controller/SupplierFeed/jeniController");
const BrahmaController = require("../../Controller/SupplierFeed/BrahmaController");
const PureLab = require("../../Controller/SupplierFeed/PureLabController");
const LightGrown = require("../../Controller/SupplierFeed/LightGrownController");
const AARush = require("../../Controller/SupplierFeed/AARush");
const EcoStar = require("../../Controller/SupplierFeed/EcoStar");
const Mareya = require("../../Controller/SupplierFeed/Meraya");
const Belgium = require("../../Controller/SupplierFeed/Beligium");
const ClassicGrown = require("../../Controller/SupplierFeed/ClassicGrown");
const prallellDiamonds = require("../../Controller/SupplierFeed/prallellDiamonds");
const Router = express.Router();

Router.get("/Jeni" , jeniController.MapData);
Router.get("/Brahma" , BrahmaController.MapData);
Router.get("/pureLab" , PureLab.MapData);
Router.get("/LightGrown" , LightGrown.MapData);
Router.get("/AARush" , AARush.MapData);
Router.get("/EcoStar" , EcoStar.MapData);
Router.get("/Mareya" , Mareya.MapData);
Router.get("/Belgium" , Belgium.MapData);
Router.get("/ClassicGrown" , ClassicGrown.MapData);
Router.get("/prallellDiamonds" , prallellDiamonds.MapData);

module.exports = Router