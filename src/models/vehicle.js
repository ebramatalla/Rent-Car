const mongoose = require("mongoose");
const typeOfVehicle = {
  car: "car",
  motorcycle: "motorcycle",
};

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    trim: true,
  },
  yearOfProduction: {
    type: Number,
    required: true,
  },

  brand: {
    type: String,
    required: true,
    trim: true,
  },
  features: {
    type: String,
    required: false,
  },
  vehicleType: {
    type: String,
    enum: typeOfVehicle,
    default: typeOfVehicle.car,
  },
  numberOfVehicle: {
    type: Number,
    default: 0,
  },
});
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
