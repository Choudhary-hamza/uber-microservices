const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true }
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }
});

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.statics.generateToken = function (_id) {
    return jwt.sign({ _id }, process.env.JWT_KEY, { expiresIn: "1h" });
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
