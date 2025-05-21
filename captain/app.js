const dotenv=require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cookieParser=require("cookie-parser");
const captainRoute=require("./routes/captain.routes");
const rabbitMq=require("./rabbitMq/rabbit");

rabbitMq.connect();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/",captainRoute);


module.exports = app;