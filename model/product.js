const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    price: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
    // costumerId: {
    //     type: Schema.Types.ObjectId,
    //     required: true,
    //     ref: "Costumer"
    // }
});

module.exports = mongoose.model("Product",productSchema);