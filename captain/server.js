const http=require("http");
const app=require("./app");
const connection=require("./db/captain.db");


const server=http.createServer(app);
connection();
server.listen(3002,()=>{
    console.log("captain server is running on port 3002");
})