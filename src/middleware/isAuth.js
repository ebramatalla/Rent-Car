const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.TOKEN_KEY);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Auth" });
  }
};
module.exports = isAuth;
