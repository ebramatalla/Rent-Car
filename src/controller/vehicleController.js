const Vehicle = require("../models/vehicle");

const addVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.send(vehicle);
  } catch (error) {
    res.send(error);
  }
};
module.exports = { addVehicle };
