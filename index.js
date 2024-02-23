const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./app/routes.js");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static('uploads'));

const jsonResponseMiddleware = (req, res, next) => {
    res.customJson = (data, status = 200, code = 'OK') => {
        res.status(status).json({
            data: data, status: status, code: code,
        });
    };
    next();
};

app.use(jsonResponseMiddleware);

app.use(routes);

app.use((req, res) => {
    res.status(404).customJson({message: 'Page Not Found'}, 404, 'NOT_FOUND');
});

mongoose.connect('mongodb://localhost:27017/products_db') // use your connection
    .then(() => {
        app.listen(3000, () => {
            console.log('Running on 3000 port!');
        })
        console.log('Connected!');
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    })
    .finally(() => {
        console.log('Connection attempt completed.');
    });