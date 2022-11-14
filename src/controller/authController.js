const User = require("../models/user");
const { validationResult } = require("express-validator");

const addUser = async (req, res) => {
  try {
    // handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // create user
    const user = new User({
      name: req.body["name"],
      email: req.body["email"],
      password: req.body["password"],
    });

    await user.save();
    const token = await user.generateToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.send(error);
  }
};

const login = async (req, res) => {
  try {
    // handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateToken();
    res.send({ user, token });
  } catch (error) {
    res.send(error);
  }
};
/**
 *
 * @param {id from req} req
 * @param {*} res
 */
const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
};
module.exports = {
  addUser,
  login,
  logout,
};
