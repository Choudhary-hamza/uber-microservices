const http=require("http");
const app=require("./app");
const connection=require("./db/user.db");


const server=http.createServer(app);
connection();
server.listen(3003,()=>{
    console.log("ride server is running on port 3003");
})