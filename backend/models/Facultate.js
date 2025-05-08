const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela Facultate din DB
const Facultate = sequelize.define('Facultate', {
    facultate_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nume: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    decan: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'facultate',
    timestamps: false
});

module.exports = Facultate;