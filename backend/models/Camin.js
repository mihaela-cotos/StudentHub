const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Tabela Camin din DB
const Camin = sequelize.define('Camin', {
    camin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nume: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    nr_locuri_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nr_locuri_libere: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nr_locuri_ocupate: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'camin',
    timestamps: false
});

module.exports = Camin;