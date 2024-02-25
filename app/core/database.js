const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/products_db'); // use your connection
        console.log('Connected to the database!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
    }
};

module.exports = {
    connect
};
