const express=require("express");
const Router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js")
const {reviewschema}=require("../Schema.js");
const review=require("../models/review.js");
const Listing=require("../models/listing.js");


const validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}

//Post review
Router.post("/",validatereview,wrapAsync(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview= new review(req.body.review);
listing.reviews.push(newreview);

await newreview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);

}));

//delete route
Router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)
}))

module.exports=Router