const mongoose = require("mongoose");
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
const User = mongoose.model("User", userSchema);
userSchema.plugin(uniqueValidator);

module.exports = User;
