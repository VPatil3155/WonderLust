const mongoose=require("mongoose");
const { type } = require("os");
const { ref } = require("process");
const schema=mongoose.Schema;
const Review=require("./review.js");

const listingschema= new schema({
title:{
    type:String,
    required:true,
},
description:String,
image:{
    type:String,
    //  default:
    //   "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) => v===""?"https://unsplash.com/photos/silhouetted-figures-watch-a-powerful-waterfall-with-rainbow-ILqZH_SZDoQ":v,
},
price:Number,
location:String,
country:String,
reviews:[{
    type:schema.Types.ObjectID,
    ref:"review",
}]
});

listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
    
})

const Listing=mongoose.model("Listing",listingschema);
module.exports=Listing;