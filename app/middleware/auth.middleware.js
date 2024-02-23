const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.customJson({message: "Unauthorized - Missing token"}, 401, "UNAUTHORIZED");
    }

    try {
        const tokenWithoutBearer = token.split(" ")[1];
        const decoded = jwt.verify(tokenWithoutBearer, "node_crud");

        req.userId = decoded.userId;

        next();
    } catch (error) {
        res.customJson({message: "Unauthorized - Invalid token"}, 401, "UNAUTHORIZED");
    }
};

module.exports = {
    authenticateUser
}
