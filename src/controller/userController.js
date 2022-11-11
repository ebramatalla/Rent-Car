const User = require("../models/user");
const { validationResult } = require("express-validator");

const addUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = new User({
      name: req.body["name"],
      email: req.body["email"],
      password: req.body["password"],
    });
    await user.save();
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};
module.exports = { addUser };
