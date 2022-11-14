const Vehicle = require("../models/vehicle");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const addVehicle = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // first search if car added before so add number of available cars 1
    const vehicleIsExist = await Vehicle.findOne({
      model: req.body.model,
      yearOfProduction: req.body.yearOfProduction,
      brand: req.body.brand,
      car: req.body.car,
    });

    if (vehicleIsExist) {
      vehicleIsExist.numberOfVehicle = vehicleIsExist.numberOfVehicle + 1;
      vehicleIsExist.numberOfAvailableVehicle =
        vehicleIsExist.numberOfAvailableVehicle + 1;
      vehicleIsExist.save();
      return res.status(201).send(vehicleIsExist);
    }
    // if not exist create new one
    const vehicle = new Vehicle(req.body);
    await vehicle.save();

    res.send(vehicle);
  } catch (error) {
    res.send(error);
  }
};

module.exports = { addVehicle };
