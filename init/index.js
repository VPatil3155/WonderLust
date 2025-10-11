const mongoose=require("mongoose");
const initdata= require("./data.js");
const Listing=require("../models/listing.js");
const { insertMany } = require("../models/listing.js");

const m_url="mongodb://127.0.0.1:27017/Wonderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(m_url);
}

const initDB= async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Data was initialized");
}
initDB();