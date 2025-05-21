const dotenv=require("dotenv");
dotenv.config();
const express = require("express");
const cors=require("cors");
const app = express();
const cookieParser=require("cookie-parser");
const userRoute=require("./routes/user.routes");
const rabbitMq=require("./rabbitMq/rabbit");

rabbitMq.connect();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/",userRoute);


module.exports = app;