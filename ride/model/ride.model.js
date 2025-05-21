const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    captainId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"captain",
    },
    pickup:{
        type:String,
        required:true,
    },
    destination:{
        type:String,
        required:true,
    }
});
const rideModel = mongoose.model("ride", rideSchema);

module.exports = rideModel;
