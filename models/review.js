const { number, date } = require("joi");
const mongoose=require("mongoose");
const { type } = require("os");
const schema=mongoose.Schema;

const reviewschema=new schema({
    Comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    cratedAt:{
        type:Date,
        default:Date.now(),
    }
})
module.exports=mongoose.model("review",reviewschema);