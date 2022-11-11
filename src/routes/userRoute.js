const express = require("express");
const UserController = require("../controller/userController");
const { body } = require("express-validator");

const router = new express.Router();

router.post(
  "/signup",
  body("name").isString().withMessage("Name Is Required and must be string"),
  body("email").isEmail().withMessage("Email is Required and must be valid "),
  body("password")
    .isString()
    .custom((value, { req }) => {
      if (value.toLowerCase().includes(req.body.name)) {
        throw new Error("password mustn't contain name ");
      }
      return true;
    })
    .isLength(7)
    .withMessage("Password must Be > 7 String"),
  UserController.addUser
);
module.exports = router;
