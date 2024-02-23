const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {username, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username, password: hashedPassword,
        });

        const savedUser = await user.save();
        res.customJson(savedUser, 201);
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

const login = async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({userId: user._id}, "node_crud", {
                expiresIn: "1h",
            });

            res.customJson({token});

        } else {
            res.customJson({message: "Invalid credentials"}, 401, "INVALID_CREDENTIALS");
        }
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        res.customJson(user);
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

module.exports = {
    register,
    login,
    getUser,
};