const mongoose = require("mongoose")
const{SELLER,BUYER} = require("../constsnts/role");

const { string } = require("joi");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const OrderSchema = new Schema({

products : [
    {
        name:{
            type:String,
            required:true,
        },
        quantity:{
            type:Number,
            min : 0,
            required : true,
        },
        price:{
            type :Number,
            min:0,
            required:true,
        },
        status:{
            type:String,
            enum : ["pending" , "shipped" , "rejected"],
            default : "pending",
        },
        product_id :{
            type : ObjectId,
            ref : "product",
            required : true,
        }
    }
    
],
created_by :{
    type : ObjectId,
    ref : "user",
    requires : true
}


});



module.exports = mongoose.model("Order",OrderSchema)