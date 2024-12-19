const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); 
const User = require("./user");

const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    newPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    oldPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.JSON
    },
    categories: {
        type: DataTypes.JSON
    },
    brands: {
        type: DataTypes.JSON
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        },
        onDelete: "NO ACTION",
        onUpdate: "CASCADE"
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: "products",
    timestamps: true
});

module.exports = Product;

Product.belongsTo(User, {
    foreignKey: 'createdBy',
    as: 'creator'
});