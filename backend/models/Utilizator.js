const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela Utilizator din DB
const Utilizator = sequelize.define('Utilizator', {
    utilizator_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nume_utilizator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    parola: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tip_utilizator: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    }
}, {
    tableName: 'utilizator',
    timestamps: false
});

module.exports = Utilizator;