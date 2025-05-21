const jwt = require("jsonwebtoken");
const blackListModel = require("../model/blackList.model");
const captainModel = require("../model/captain.model");

module.exports.captainAuthentication = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "unauthorized" });
    }
    const isBlacklist = await blackListModel.findOne({ token });
    if (isBlacklist) {
        return res.status(401).json({ message: "unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await captainModel.findById({ _id: decoded._id });
        if (!user) {
            return res.status(401).json({ message: "unauthorized" });
        }
        req.captain = user;
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
    return next();
}