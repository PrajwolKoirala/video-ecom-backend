// models/User.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { SELLER, BUYER } = require("../constsnts/role");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { len: [1, 255] }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            async isUnique(value) {
                const user = await User.findOne({ where: { email: value } });
                if (user) {
                    throw new Error("Email already exists");
                }
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM(SELLER, BUYER),
        allowNull: false,
        set(value) {
            this.setDataValue("role", value.toLowerCase());
        }
    },
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0 }
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;