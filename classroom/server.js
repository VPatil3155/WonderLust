const express=require("express");
const app=express();
const cookieparser=require("cookie-parser");
const session= require("express-session");
const { Server } = require("node:http");

app.use(session({secret:"mysupersecrte string" , resave:false,saveUninitialized:true}));
app.get("/test",(req,res)=>{
    res.send("test successful");
})

app.listen(3000,()=>{
    console.log("server is listening on the port 3000")
})
