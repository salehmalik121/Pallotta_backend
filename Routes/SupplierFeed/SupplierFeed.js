const express = require("express");
const bodyParser = require("body-parser")
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
const BrahmaniDiamonds = require("../../Controller/SupplierFeed/Brahmani");
const RRajesh = require("../../Controller/SupplierFeed/RRjesh");
const BrahmaniNatural = require("../../Controller/SupplierFeed/Brahmani Natural");
const Rays = require("../../Controller/SupplierFeed/Rays");
const Anjali = require("../../Controller/SupplierFeed/Anjali");
const EcoGrown = require("../../Controller/SupplierFeed/EcoGrown");
const ShreeSuktam = require("../../Controller/SupplierFeed/ShreeSuktam");
//const NewGrown = require("../../Controller/SupplierFeed/NewGrown");
const PallottaSingle = require("../../Controller/SupplierFeed/PallottaSingle");

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
Router.get("/Brahmani" , BrahmaniDiamonds.MapData);
Router.get("/RRajesh" , RRajesh.MapData );
Router.get("/BrahmaniNatural" , BrahmaniNatural.MapData );
Router.get("/Rays" , Rays.MapData );
Router.get("/Anjali" , Anjali.MapData );
Router.get("/EcoGrown" , EcoGrown.MapData );
Router.get("/ShreeSuktam" , ShreeSuktam.MapData );
Router.post("/pallottaSingle/:natural/:colored" , bodyParser.json() , PallottaSingle.addSingleDiamond );

//Router.get("/NewGrown" , NewGrown.MapData );

module.exports = Router