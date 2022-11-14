const express = require("express");
const route = express.Router();
const { body, param } = require("express-validator");
const Vehicle = require("../models/vehicle");
const isAuth = require("../middleware/isAuth");
const isRole = require("../middleware/isRole");
const { Roles } = require("../models/user");
const adminController = require("../controller/adminController");

// Add Vehicle
route.post(
  "/addVehicle",
  isAuth,
  isRole([Roles.admin]),
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
  body("costPerDay").isNumeric().withMessage("Cost  is required"),

  adminController.addVehicle
);
module.exports = route;
