const express = require("express");
const route = express.Router();

const vehicleController = require("../controller/vehicleController");

route.post("/addVehicle", vehicleController.addVehicle);
module.exports = route;
