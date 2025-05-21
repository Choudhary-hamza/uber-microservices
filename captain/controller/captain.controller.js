const captainModel = require("../model/captain.model");
const { validationResult } = require("express-validator");
const blackListModel = require("../model/blackList.model");
const { subscribeToQueue } = require("../rabbitMq/rabbit");

let pendingRequests = [];

module.exports.createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid input", errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const isAlreadyRegistered = await captainModel.findOne({ email });
    if (isAlreadyRegistered) {
        return res.status(400).json({ msg: "Email already registered" });
    }
    const hashingPassword = await captainModel.hashPassword(password);
    const captain = await captainModel.create({
        fullName: {
            firstName: fullName.firstName,
            lastName: fullName.lastName
        },
        email,
        password: hashingPassword
    });
    const captainObject = captain.toObject();
    delete captainObject.password;
    if (!captainObject) {
        return res.status(401).json({ msg: "Failed to register captain" });
    }
    const token = await captainModel.generateToken(captain._id);
    res.cookie("token", token);
    return res.status(201).json({ token, captain: captainObject });
}

module.exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: "Invalid input", errors: errors.array() });
    }
    const { email, password } = req.body;
    const captain = await captainModel.findOne({ email }).select("+password");
    if (!captain) {
        return res.status(401).json({ msg: "Invalid email or password" });
    }
    const comparePassword = await captain.comparePassword(password);
    if (!comparePassword) {
        return res.status(401).json({ msg: "invalid email or password" });
    }
    const captainObject = captain.toObject();
    delete captainObject.password;
    const token = await captainModel.generateToken(captain._id);
    res.cookie("token", token);
    return res.status(200).json({ token, captain: captainObject });
}

module.exports.getProfile = async (req, res) => {
    const captain = req.captain;
    return res.status(200).json(captain);
}

module.exports.logoutUser = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];
    res.clearCookie("token");
    await blackListModel.create({ token });
    return res.status(200).json({ msg: "Logged out successfully" });
}

module.exports.requestNewRide = async (req, res) => {
    req.setTimeout(30000, () => {
        res.status(204).end();
    });
    pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
    const rideData = JSON.parse(data);
    pendingRequests.forEach(res => {
        res.json(rideData);
    });
    pendingRequests.length = 0;
});