const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodoverride=require("method-override");

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

app.get("/",(req,res)=>{
    res.send("working");
});
//index route
app.get("/listings",async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
});
//create route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})
//show route
app.get("/listings/:id",async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
})
//create route
app.post("/listings",async(req,res)=>{
    const newlisting= new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings");
})
//update route
app.get("/listings/:id/edit",async(req,res)=>{
      let{id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
})

app.put("/listings/:id",async(req,res)=>{
   let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
})

app.delete("/listings/:id",async(req,res)=>{
 let{id}=req.params;
 let deletedlisting=await Listing.findByIdAndDelete(id);
 res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("the port is listening on port 8080");
});
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