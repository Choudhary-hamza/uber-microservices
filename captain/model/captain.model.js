const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    isAvailable:{
        type:String,
        enum: ["available", "unavailable"],
        default: "unavailable"
    }
});

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.generateToken = function (_id) {
    return jwt.sign({ _id }, process.env.JWT_KEY, { expiresIn: "1h" });
};

const captainModel = mongoose.model("captain", captainSchema);

module.exports = captainModel;
