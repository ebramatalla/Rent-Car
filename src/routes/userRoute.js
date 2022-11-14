const express = require("express");
const UserController = require("../controller/userController");
const { body, param } = require("express-validator");
const isAuth = require("../middleware/isAuth");
const isRole = require("../middleware/isRole");
const { Roles } = require("../models/user");
const route = express.Router();
const Vehicle = require("../models/vehicle");

route.patch(
  "/edit",
  isAuth,
  isRole([Roles.user, Roles.admin]),
  body("name")
    .isString()
    .optional()
    .withMessage("Name Is Required and must be string"),
  body("email")
    .isEmail()
    .optional()
    .withMessage("Email is Required and must be valid "),
  body("password")
    .isString()
    .optional()
    .custom((value, { req }) => {
      if (value.toLowerCase().includes(req.body.name)) {
        throw new Error("password mustn't contain name ");
      }
      return true;
    })
    .isLength(7)
    .withMessage("Password must Be > 7 String"),

  UserController.updateUser
);
route.post(
  "/rent/:id",
  isAuth,
  isRole([Roles.user]),

  param("id")
    .isMongoId()
    .custom(async (value, { req }) => {
      const vehicle = await Vehicle.findById(value);
      if (!vehicle) {
        throw new Error("This vehicle Is Invalid");
      }
      return true;
    }),
  UserController.rentVehicle
);
route.post(
  "/return",
  isAuth,
  isRole([Roles.user]),
  param("id")
    .isMongoId()
    .custom(async (value, { req }) => {
      const vehicle = await Vehicle.findById(value);
      if (!vehicle) {
        throw new Error("This vehicle Is Invalid");
      }
      return true;
    }),
  body("returnCode").isNumeric().withMessage("returnCode Must Be Number"),
  UserController.returnCar
);
module.exports = route;
