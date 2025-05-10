const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Utilizator = require('./Utilizator');

// Tabela Administrator din DB
const Administrator = sequelize.define('Administrator', {
    admin_id: {
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
    approved_by_system: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'administrator',
    timestamps: false
});

Utilizator.hasOne(Administrator, { foreignKey: 'utilizator_id' });
Administrator.belongsTo(Utilizator, { foreignKey: 'utilizator_id' });

module.exports = Administrator;