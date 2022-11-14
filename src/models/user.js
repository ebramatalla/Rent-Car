const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();

var uniqueValidator = require("mongoose-unique-validator");
const role = {
  admin: "admin",
  user: "user",
};

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // `email` must be unique
  },
  role: {
    type: String,
    enum: role,
    default: role.user,
  },

  password: {
    type: String,
    require: true,
    trim: true,
    minlength: 7,
    validator(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Password is week");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  returnCode: {
    type: Number,
  },

  currentCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  startRent: {
    type: Date,
  },
  endRent: {
    type: Date,
  },
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { error: "User Not Found" };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: "Incorrect Password" };
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.generateToken = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    process.env.TOKEN_KEY
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

const User = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator);

module.exports = User;
module.exports.Roles = role;
