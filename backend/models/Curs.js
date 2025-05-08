const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Facultate = require('./Facultate');

// Tabela Curs din DB
const Curs = sequelize.define('Curs', {
    curs_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nume: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    sala: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    profesor: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    facultate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Facultate,
            key: 'facultate_id'
        }
    }
}, {
    tableName: 'curs',
    timestamps: false
});

Facultate.hasMany(Curs, { foreignKey: 'facultate_id' });
Curs.belongsTo(Facultate, { foreignKey: 'facultate_id' });

module.exports = Curs;