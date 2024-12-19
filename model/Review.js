const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ReviewSchema = new Schema({

    review_text : {
        type : String,
        maxlength : 999,
    },
    reviewed_by : {
        type: ObjectId, 
        required:true,
        ref : "user"
    },
    product_reviewed : {
        type: ObjectId, 
        required:true,
        ref : "products"
    }


});



module.exports = mongoose.model("Review",ReviewSchema)