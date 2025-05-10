const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Facultate = require('./Facultate');
const Utilizator = require('./Utilizator');

// Tabela Student din DB
const Student = sequelize.define('Student', {
    student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grupa: {
        type: DataTypes.STRING,
        allowNull: false
    },
    facultate_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Facultate,
            key: 'facultate_id'
        }
    },
    utilizator_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Utilizator,
            key: 'utilizator_id'
        }
    }
}, {
    tableName: 'student',
    timestamps: false
});

Facultate.hasMany(Student, { foreignKey: 'facultate_id', onDelete: 'SET NULL' });
Student.belongsTo(Facultate, { foreignKey: 'facultate_id'});

Utilizator.hasOne(Student, { foreignKey: 'utilizator_id' });
Student.belongsTo(Utilizator, { foreignKey: 'utilizator_id'});

module.exports = Student;
