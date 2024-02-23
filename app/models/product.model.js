const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    name: {
        type: String, // type
        required: [true, "Product name is required!"], // [bool, comment]
    }, quantity: {
        type: Number, required: true,
        default: 0
    }, price: {
        type: Number, required: true, default: 0
    }, owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
    }, images: [{type: mongoose.Schema.Types.ObjectId, ref: 'ProductImage'}],
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;