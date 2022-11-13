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
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};
const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("Not found");
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
};
module.exports = { addUser, updateUser };
