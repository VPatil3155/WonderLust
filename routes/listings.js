const express=require("express");
const Router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {listingschema}=require("../Schema.js");

const validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//index route
Router.get("/",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//create route
Router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
})
//show route
Router.get("/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}))
//create route
Router.post("/",validatelisting,wrapAsync(async(req,res,next)=>{
    const newlisting= new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings");
}))
//update route
Router.get("/:id/edit",wrapAsync(async(req,res)=>{
      let{id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

Router.put("/:id",validatelisting,wrapAsync(async(req,res)=>{
   let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}))

Router.delete("/:id",wrapAsync(async(req,res)=>{
 let{id}=req.params;
 let deletedlisting=await Listing.findByIdAndDelete(id);
 res.redirect("/listings");
}))

module.exports=Router;