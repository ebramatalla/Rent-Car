const Vehicle = require("../models/vehicle");
const { validationResult } = require("express-validator");

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
const rentVehicle = async (req, res) => {
  try {
    // handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle || vehicle.numberOfVehicle == 0) {
      return res.status(404).send("This vehicle not available now");
    }
    vehicle.numberOfVehicle = vehicle.numberOfVehicle - 1;

    await vehicle.save();
    res.status(200).send({ message: "Rent " });
  } catch (error) {
    return res.status(400).send(error);
  }
};
module.exports = { addVehicle, rentVehicle };
