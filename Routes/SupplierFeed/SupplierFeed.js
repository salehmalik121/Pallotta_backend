const express = require("express");
const jeniController = require("../../Controller/SupplierFeed/jeniController");
const BrahmaController = require("../../Controller/SupplierFeed/BrahmaController");

const Router = express.Router();

Router.get("/Jeni" , jeniController.MapData);
Router.get("/Brahma" , BrahmaController.MapData);

module.exports = Router