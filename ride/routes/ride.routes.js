const express = require("express");
const rideRoute = express.Router();
const rideController = require("../controller/ride.controller");
const middleware=require("../middleware/rideMiddleware");

rideRoute.post("/create-ride",middleware.userAuthentication,rideController.createRide);
module.exports = rideRoute;