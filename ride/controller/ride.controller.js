const rideModel=require("../model/ride.model");
const {publishToQueue}=require("../rabbit/rabbit");

module.exports.createRide=async(req,res)=>{
    const {pickup,destination}=req.body;
    const ride=await rideModel.create({
        userId:req.user._id,
        pickup,
        destination
    })
    publishToQueue("new-ride",JSON.stringify(ride));
    res.status(201).json(ride);
}
