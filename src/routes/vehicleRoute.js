const express = require("express");
const route = express.Router();
const { body, param } = require("express-validator");
const Vehicle = require("../models/vehicle");

const vehicleController = require("../controller/vehicleController");
// Add Vehicle
route.post(
  "/addVehicle",
  body("model").isString().withMessage("Model is required"),

  body("yearOfProduction")
    .isNumeric()
    .custom((value, { req }) => {
      if (value < 2010) {
        throw new Error("car Production year is older than 2010 ");
      }
      return true;
    })
    .withMessage("yearOfProduction is required and must be number in > 2010"),

  body("brand").isString().withMessage("brand is required"),

  body("vehicleType").isString().withMessage("vehicleType is required"),

  vehicleController.addVehicle
);
// rent car
route.post(
  "/rent/:id",
  param("id")
    .isMongoId()
    .custom(async (value, { req }) => {
      const vehicle = await Vehicle.findById(value);
      if (!vehicle) {
        throw new Error("This vehicle Is Invalid");
      }
      return true;
    }),
  vehicleController.rentVehicle
);
module.exports = route;
