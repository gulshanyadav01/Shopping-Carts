const mongoose = require("mongoose");
const { schema } = require("./product");

const Schema = mongoose.Schema;

const costumerSchema = new Schema({
 
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    cart: {
        items: [{
            productId:{
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            },
            quantity:{
                type: Number,
                required: true
            }
        }]
    }
})

costumerSchema.methods.addToCart = function(product){
    const cartProductIndex = this.cart.items.findIndex(cp =>{
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity =1;
    const updatedCartProduct = this.cart.items;
    if(cartProductIndex >= 0){
        newQuantity = updatedCartProduct[cartProductIndex].quantity+1;
        updatedCartProduct[cartProductIndex].quantity =newQuantity;
    }
    else{
        updatedCartProduct.push({
            productId: product._id,
            quantity: newQuantity
        })
    }
    this.cart.items = updatedCartProduct;
    return this.save();
}

costumerSchema.methods.deleteCartProducts  = function (productId){

    const updatedCart = this.cart.items.filter(items =>{
        return items.productId.toString() !== productId.toString();
    })
    this.cart.items = updatedCart;
    return this.save();

}

module.exports = mongoose.model("Costumer",costumerSchema);