const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path = require("path");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js")
const ExpressError=require("./utils/ExpressError.js")
const {listingschema,reviewschema}=require("./Schema.js");
const Review=require("./models/review.js");

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

const validatelisting=(req,res,next)=>{
    let{error}=listingschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
const validatereview=(req,res,next)=>{
    let{error}=reviewschema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }else{
        next();
    }
}
//index route
app.get("/listings",wrapAsync(async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//create route
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
})
//show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}=req.params;
    const listing= await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}))
//create route
app.post("/listings",validatelisting,wrapAsync(async(req,res,next)=>{
    const newlisting= new Listing(req.body.listing);
   await newlisting.save();
   res.redirect("/listings");
}))
//update route
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
      let{id}=req.params;
    const listing= await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}))

app.put("/listings/:id",validatelisting,wrapAsync(async(req,res)=>{
   let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);
}))

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
 let{id}=req.params;
 let deletedlisting=await Listing.findByIdAndDelete(id);
 res.redirect("/listings");
}))

//Review
//Post review
app.post("/listings/:id/reviews",validatereview,wrapAsync(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newreview= new Review(req.body.review);
listing.reviews.push(newreview);

await newreview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);

}));
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