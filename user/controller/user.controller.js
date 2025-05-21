const userModel = require("../model/user.model");
const { validationResult } = require("express-validator");
const blackListModel = require("../model/blackList.model");

module.exports.createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid input", errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const isAlreadyRegistered = await userModel.findOne({ email });
    if (isAlreadyRegistered) {
        return res.status(400).json({ msg: "Email already registered" });
    }
    const hashingPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
        fullName: {
            firstName: fullName.firstName,
            lastName: fullName.lastName
        },
        email,
        password: hashingPassword
    });
    const userObject = user.toObject();
    delete userObject.password;
    if (!userObject) {
        return res.status(401).json({ msg: "Failed to register user" });
    }
    const token = await userModel.generateToken(user._id);
    res.cookie("token", token);
    return res.status(201).json({ token, user:userObject });
}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid input", errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        return res.status(401).json({ msg: "Invalid email or password" });
    }
    const comparePassword = await user.comparePassword(password);
    if (!comparePassword) {
        return res.status(401).json({ msg: "invalid email or password" });
    }
    const userObject = user.toObject();
    delete userObject.password;
    const token = await userModel.generateToken(user._id);
    res.cookie("token", token);
    return res.status(200).json({ token, user:userObject });
}

module.exports.getProfile = async (req, res, next) => {
    const user = req.user;
    return res.status(200).json(user);
}

module.exports.logoutUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    res.clearCookie("token");
    await blackListModel.create({ token });
    return res.status(200).json({ msg: "Logged out successfully" });
}