require("../src/database/mongoose");
const express = require("express");
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const authRoute = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(userRoute);
app.use(adminRoute);
app.use(authRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("listening on port " + port);
});
