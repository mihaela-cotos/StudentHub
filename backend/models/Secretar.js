const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilizator = require('./Utilizator');

// Tabela Secretar din DB
const Secretar = sequelize.define('Secretar', {
    secretar_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    utilizator_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizator,
            key: 'utilizator_id'
        }
    },
    approved: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'secretar',
    timestamps: false
});

Utilizator.hasOne(Secretar, { foreignKey: 'utilizator_id' });
Secretar.belongsTo(Utilizator, { foreignKey: 'utilizator_id' });

module.exports = Secretar;