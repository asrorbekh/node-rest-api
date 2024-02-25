const express = require("express");
const app = express();
const mongoose = require("mongoose");
const routes = require("./app/routes.js");
const helper = require("./app/utils/helper.js")
const database = require("./app/core/database");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
const assetsPath = express.static('public');
app.use(assetsPath);

app.use(helper.jsonResponseMiddleware);

app.use(routes);

app.use(helper.handleNotFound);

database.connect()
    .then(() => {
        app.listen(3000, () => {
            console.log('Running on http://localhost:3000!');
        });
        console.log('Connection attempt completed.');
    })
    .catch((error) => {
        console.error('Error starting the app:', error);
    });