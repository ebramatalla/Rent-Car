const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
});
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});
const User = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator);

module.exports = User;
