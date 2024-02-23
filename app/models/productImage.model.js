const mongoose = require('mongoose');

const productImageSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    filename: String,
});

const ProductImage = mongoose.model('ProductImage', productImageSchema);

module.exports = ProductImage;