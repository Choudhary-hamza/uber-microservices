const mongoose=require("mongoose");

const connection=()=>{
    mongoose.connect(process.env.DB_CONNECTION).then(()=>
        console.log("database has been connected")
    ).catch((error)=>{
        console.log(error);
    })
}

module.exports=connection;