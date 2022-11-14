const Vehicle = require("../models/vehicle");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const { Roles } = require("../models/user");

const getAllUsers = async (req, res) => {
  try {
    const allUser = await User.find({ role: "user" });
    return res.send(allUser);
  } catch (error) {
    res.status(400).send(error);
  }
};
const getAllVehicle = async (req, res) => {
  try {
    const { role } = req.user;
    let query = {};
    switch (role) {
      case Roles.admin:
        query = {};
        break;
      case Roles.user:
        query = { numberOfAvailableVehicle: { $gt: 0 } };
    }
    const allVehicle = await Vehicle.find(query);
    return res.send(allVehicle);
  } catch (error) {
    res.status(400).send(error);
  }
};

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

const getReturnCode = async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("This Email is Invalid");
    }
    if (!user.currentCar) {
      throw new Error("This Email haven't Car");
    }
    const vehicle = await Vehicle.findById(user.currentCar);
    user.endRent = new Date();
    // get Time Of Hour
    timeOfRent = Math.abs(user.startRent - user.endRent) / 3600000;

    Cost = timeOfRent * vehicle.costPerHour;

    await user.save();

    res.send({
      Code: user.returnCode,
      Cost,
      timeOfRent: "You Rent Car For " + timeOfRent + " Hour",
    });
  } catch (error) {}
};

module.exports = { getAllUsers, addVehicle, getReturnCode, getAllVehicle };
