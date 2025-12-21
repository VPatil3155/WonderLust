const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js")


const listings= require("./routes/listings.js");
const reviews=require("./routes/review.js");

const m_url="mongodb://127.0.0.1:27017/Wonderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(m_url);
}
 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")))


app.get("/",(req,res)=>{
    res.send("working");
     console.log(Listing.price);
});

app.get("/demousr",async(req,res)=>{
    res.send("demo user working");
}
app.use("/listings",listings); 
app.use("/listings/:id/reviews",reviews);

app.listen(8080,()=>{
    console.log("the port is listening on port 8080");
});

app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message})
    // res.status(statusCode).send(message);
})




// app.get("/testListing",async(req,res)=>{
// let samplelisting = new Listing({
//     title:"My new Villa",
//     description:"By the beach",
//     price:1200,
//     location:"ratnagiri",
//     country:"India",
// });

// await samplelisting.save();
// console.log("Sample was saved");
// res.send("Working good");
// });