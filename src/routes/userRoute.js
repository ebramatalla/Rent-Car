const express = require("express");
const UserController = require("../controller/userController");
const { body } = require("express-validator");
const isAuth = require("../middleware/isAuth");
const isRole = require("../middleware/isRole");
const { Roles } = require("../models/user");

const router = express.Router();

router.patch(
  "/edit/:id",
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
  isAuth,
  isRole([Roles.user]),
  UserController.updateUser
);
module.exports = router;
