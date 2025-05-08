const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Curs = require('./Curs');

// Tabela Orar_curs din DB
const OrarCurs = sequelize.define('Orar_curs', {
    orar_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    curs_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Curs,
            key: 'curs_id'
        }
    },
    ziua_saptamanii: {
        type: DataTypes.ENUM('luni', 'marti', 'miercuri', 'joi', 'vineri', 'sambata', 'duminica'),
        allowNull: false
    },
    ora: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'orar_curs',
    timestamps: false
});

Curs.hasMany(OrarCurs, { foreignKey: 'curs_id' });
OrarCurs.belongsTo(Curs, { foreignKey: 'curs_id' });

module.exports = OrarCurs;