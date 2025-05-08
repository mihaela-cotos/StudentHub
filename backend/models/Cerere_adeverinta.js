const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');

// Tabela Cerere_adeverinta din DB
const CerereAdeverinta = sequelize.define('Cerere_adeverinta', {
    cerere_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'student_id'
        }
    },
    tip_adeverinta: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    data_cerere: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_emitere: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'cerere_adeverinta',
    timestamps: false
});

Student.hasMany(CerereAdeverinta, { foreignKey: 'student_id' });
CerereAdeverinta.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = CerereAdeverinta;