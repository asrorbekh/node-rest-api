const jsonResponseMiddleware = (req, res, next) => {
    res.customJson = (data, status = 200, code = 'OK') => {
        res.status(status).json({
            data: data, status: status, code: code,
        });
    };
    next();
};

const handleNotFound = async (req, res) => {
    try {
        res.customJson({message: 'Page Not Found'}, 404, 'NOT_FOUND');
    } catch (error) {
        res.customJson({message: error.message}, 500, "INTERNAL_SERVER_ERROR");
    }
};

module.exports = {
    jsonResponseMiddleware,
    handleNotFound
};