// importing modules
const express = require("express");
const connectDataBase = require("./config/database");
const userRoute = require("./routes/user");
const PORT = 3000;
// initialise Express
const app = express();

// Connecting Database
connectDataBase();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/user", userRoute);

// Listening to port
app.listen(PORT, () => {
  console.log("Server Started");
});
