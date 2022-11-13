require("../src/database/mongoose");
const express = require("express");
const userRoute = require("./routes/userRoute");
const vehicleRoute = require("./routes/vehicleRoute");
const authRoute = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(userRoute);
app.use(vehicleRoute);
app.use(authRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});

/**
 * to do tomorrow auth and isRole
 */
