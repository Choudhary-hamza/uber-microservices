const express = require("express");
const { body } = require("express-validator");
const captainRoute = express.Router();
const captainController = require("../controller/captain.controller");
const middleware = require("../middleware/captainAuth.middleware");

captainRoute.post("/register", [
    body("email").isEmail().withMessage("Email is invalid"),
    body("fullName.firstName").isLength({ min: 3 }).withMessage("first name should be of minimum length of 3 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password should be greater than 6 characters"),
], captainController.createUser);

captainRoute.post("/login", [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({ min: 6 }).withMessage("Password should be greater than the 6 characters"),
], captainController.loginUser);

captainRoute.get("/profile", middleware.captainAuthentication, captainController.getProfile);
captainRoute.get("/logout", middleware.captainAuthentication, captainController.logoutUser);
captainRoute.get("/new-ride", middleware.captainAuthentication, captainController.requestNewRide);

module.exports = captainRoute;