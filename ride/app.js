const dotenv=require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser=require("cookie-parser");
const rideRoute=require("./routes/ride.routes");
const rabbitMq=require("./rabbit/rabbit");

rabbitMq.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/",rideRoute);


module.exports = app;