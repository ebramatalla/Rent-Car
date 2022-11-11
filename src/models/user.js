const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");
const validator = require("validator");

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
