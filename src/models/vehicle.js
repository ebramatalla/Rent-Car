const mongoose = require("mongoose");
const typeOfVehicle = {
  car: "car",
  motorcycle: "motorcycle",
};

const vehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Features: {
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
  },
});
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
