const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const upload = require('../../services/multer.upload.service');

router.post('/', authMiddleware.authenticateUser, upload.array('images'), productController.createProduct);
router.put('/:id', authMiddleware.authenticateUser, upload.array('images'), productController.updateProduct);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.delete('/:id', authMiddleware.authenticateUser, productController.deleteProduct);

module.exports = router;
