const Product = require('../models/product.model');
const ProductImage = require('../models/productImage.model.js');
const fs = require('fs/promises');
const path = require('path');

const createProduct = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;

        if (!name || !quantity || !price) {
            return res.customJson({ message: 'Missing required parameters' }, 406, 'NOT_ACCEPTABLE');
        }

        const product = await Product.create({
            ...req.body,
            owner: req.userId,
        });

        // Save product images
        const imageFiles = req.files || [];
        // Update product with saved image references
        product.images = await Promise.all(
            imageFiles.map(async (file) => {
                const image = await ProductImage.create({
                    productId: product._id,
                    filename: file.filename,
                });
                return image._id;
            })
        );
        await product.save();

        return res.customJson(product);
    } catch (error) {
        res.customJson({ message: error.message }, 500, 'INTERNAL_SERVER_ERROR');
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, quantity, price } = req.body;
        const productId = req.params.id;

        const existingProduct = await Product.findById(productId);

        if (!existingProduct) {
            return res.customJson({ message: 'Product not found' }, 404, 'NOT_FOUND');
        }

        const imageFiles = req.files || [];

        let updatedProduct;

        if (imageFiles.length && imageFiles.length > 0){

            for (const imageId of existingProduct.images) {
                const image = await ProductImage.findById(imageId);
                if (image) {
                    const imagePath = path.join(__dirname, '../uploads', image.filename);
                    if (imagePath){
                        await fs.unlink(imagePath);
                    }
                }
            }

            await ProductImage.deleteMany({ productId: existingProduct._id });

            const savedImages = await Promise.all(
                imageFiles.map(async (file) => {
                    const image = await ProductImage.create({
                        productId: existingProduct._id,
                        filename: file.filename,
                    });
                    return image._id;
                })
            );

            updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { name, quantity, price, images: savedImages },
                { new: true }
            );
        } else {
            updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { name, quantity, price },
                { new: true }
            );
        }


        return res.customJson(updatedProduct);
    } catch (error) {
        res.customJson({ message: error.message }, 500, 'INTERNAL_SERVER_ERROR');
    }
};

const getProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', filter = {} } = req.query;

        const query = {
            $and: [
                filter,
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                    ],
                },
            ],
        };

        const totalCount = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        let responseJson = {};

        if (req.query.page || req.query.limit) {
            responseJson.products = products;
            responseJson.pagination = {
                totalItems: totalCount,
                totalPages,
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            };
        } else {
            responseJson.products = products;
            responseJson.pagination = {
                totalItems: responseJson.products.length,
                totalPages: Math.ceil(responseJson.products.length / 10),
                currentPage: 1,
                pageSize: 10,
            };
        }

        res.customJson(responseJson);
    } catch (error) {
        res.customJson({ message: error.message }, 500, 'INTERNAL_SERVER_ERROR');
    }
};
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.customJson(product);
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.customJson({message: 'Product not found'}, 404, "NOT_FOUND");
        }

        res.customJson({message: 'Product deleted successfully', deletedProduct});
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

module.exports = {
    createProduct, getProducts, getProductById, updateProduct, deleteProduct,
}