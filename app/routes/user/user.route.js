const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user.controller");
const authMiddleware = require("../../middleware/auth.middleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware.authenticateUser, userController.getUser);

module.exports = router;
