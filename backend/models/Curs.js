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
        allowNull: true
    },
    profesor: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    facultate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Facultate,
            key: 'facultate_id'
        }
    },
    an_invatamant: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'curs',
    timestamps: false
});

Facultate.hasMany(Curs, { foreignKey: 'facultate_id' });
Curs.belongsTo(Facultate, { foreignKey: 'facultate_id' });

module.exports = Curs;