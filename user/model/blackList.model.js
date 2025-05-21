const mongoose = require("mongoose");

const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400
    }
});

const blackListModel = mongoose.model("BlackList", blackListSchema);

module.exports = blackListModel;