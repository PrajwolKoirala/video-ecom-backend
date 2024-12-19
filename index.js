// index.js
const express = require("express");
const cors = require('cors');
const { sequelize } = require("./config/database");
const fileUpload = require("express-fileupload");
const path = require('path');
require('dotenv').config();

const auth_route = require("./route/auth.js");
const product_route = require("./route/product.js");
const order_route = require("./route/order");
const review_route = require("./route/review");

const PORT = process.env.PORT || 8000;
const app = express();

// Middleware setup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api", auth_route);
app.use("/api/products", product_route);
// app.use("/api/orders", order_route);
// app.use("/api/review", review_route);

// 404 Handler
app.use((req, res) => {
    res.status(404).send({
        msg: "Resource not found"
    });
});

// Error Handler
app.use((err, req, res, next) => {
    let status = 500;
    let msg = "SERVER error";
    let errors = [];

    if (err.name === "ValidationError") {
        status = 400;
        msg = "Bad request";
        
        let error_arr = Object.entries(err.errors);
        let temp = [];
        error_arr.forEach(el => {
            let obj = {};
            obj.params = el[0];
            obj.msg = el[1].message;
            temp.push(obj);
        }); 
        errors = temp;
    }

    res.status(status).send({
        msg: msg,
        errors,
        error: err.message
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("✓ Database connected successfully");
        
        // Sync models with database
        await sequelize.sync({ alter: false });
        console.log("✓ Database models synchronized");

        app.listen(PORT, () => {
            console.log(`✓ Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("✗ Error starting server:", error);
        process.exit(1);
    }
};

startServer();