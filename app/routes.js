const express = require("express");
const router = express.Router();
const userRoutes = require("./routes/user/user.route");
const productRoutes = require("./routes/product/product.route");

router.get('/', (req, res) => {
    res.customJson("API IS WORKING");
});

// User routes
router.use("/api/user", userRoutes);

// Product routes
router.use("/api/products", productRoutes);

module.exports = router;
