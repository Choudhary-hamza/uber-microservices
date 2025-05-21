const express = require("express");
const {body} = require("express-validator");
const userRoute = express.Router();
const userController = require("../controller/user.controller");
const middleware=require("../middleware/userAuth.middleware");

userRoute.post("/register",[
    body("email").isEmail().withMessage("Email is invalid"),
    body("fullName.firstName").isLength({min:3}).withMessage("first name should be of minimum length of 3 characters"),
    body("password").isLength({min:6}).withMessage("Password should be greater than 6 characters"),
],userController.createUser);

userRoute.post("/login",[
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").isLength({min:6}).withMessage("Password should be greater than the 6 characters"),
],userController.loginUser);

userRoute.get("/profile",middleware.userAuthentication,userController.getProfile);
userRoute.get("/logout",middleware.userAuthentication,userController.logoutUser);

module.exports = userRoute;