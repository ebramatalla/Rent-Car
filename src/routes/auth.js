const express = require("express");
const authController = require("../controller/authController");
const { body } = require("express-validator");
const router = express.Router();

//sign up
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
  authController.addUser
);
//login
router.post("/login", authController.login);

module.exports = router;
