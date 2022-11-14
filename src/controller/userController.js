const User = require("../models/user");
const { validationResult } = require("express-validator");
const Vehicle = require("../models/vehicle");

const updateUser = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const user = await User.findById(req.user.id).select("name email ");
    if (!user) {
      return res.status(404).send("Not found");
    }
    updates.forEach((update) => {
      user[update] = req.body[update];
    });
    await user.save();
    res.status(200).send(user);
  } catch (error) {
    return res.status(400).send(error);
  }
};

/////////////////////////// Vehicle \\\\\\\\\\\\\\\\\\\\\\\\\\\
const rentVehicle = async (req, res) => {
  try {
    // handle errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (
      !vehicle ||
      vehicle.numberOfVehicle == 0 ||
      vehicle.numberOfAvailableVehicle == 0
    ) {
      return res
        .status(404)
        .send({ message: "This vehicle not available now" });
    }
    if (req.user.currentCar) {
      return res
        .status(400)
        .send({ message: "Please return Car to rent again" });
    }
    vehicle.numberOfAvailableVehicle = vehicle.numberOfAvailableVehicle - 1;
    req.user.returnCode = random();

    req.user.currentCar = vehicle._id;
    req.user.startRent = new Date();
    await vehicle.save();
    await req.user.save();
    res.status(200).send({ message: "Rent ", vehicle });
  } catch (error) {
    return res.status(400).send(error);
  }
};

const returnCar = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.user.currentCar);
    if (!vehicle) {
      return res.status(404).send({ Error: "You don't Rent Car" });
    }
    console.log(req.body.returnCode);
    console.log(req.user.returnCode);
    reqReturnCode = req.body.returnCode;
    userReturnCode = req.user.returnCode;

    if (reqReturnCode !== userReturnCode) {
      return res.status(400).send({
        Error:
          "Please Go To Admin In automobile exhibition and ask for return code",
      });
    }

    req.user.currentCar = null;
    req.user.startRent = null;
    req.user.endRent = null;
    vehicle.numberOfAvailableVehicle = vehicle.numberOfAvailableVehicle + 1;
    await vehicle.save();
    await req.user.save();
    res.send({ message: "Car Returned" });
  } catch (error) {
    res.status(400).send(error);
  }
};
function random() {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
}
module.exports = { updateUser, rentVehicle, returnCar };
