// // config/database.js
// const Sequelize = require("sequelize");
// require("dotenv").config();

// const sequelize = new Sequelize({
//     database: process.env.DB_NAME || "srijana_backend",
//     username: process.env.DB_USER || "root",
//     password: process.env.DB_PASSWORD || "",
//     host: process.env.DB_HOST || "localhost",
//     port: process.env.DB_PORT || 3306,
//     dialect: "mysql",
//     logging: process.env.NODE_ENV === "production" ? false : console.log,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     },
//     dialectOptions: {
//         connectTimeout: 60000
//     }
// });

// module.exports = sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('srijana_backend', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql' // or 'postgres', 'sqlite', etc.
});

module.exports = { sequelize };
