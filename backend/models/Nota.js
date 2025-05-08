const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Student = require('./Student');
const Curs = require('./Curs');

// Tabela Nota din DB
const Nota = sequelize.define('Nota', {
    nota_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valoare: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'student_id'
        }
    },
    curs_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Curs,
            key: 'curs_id'
        }
    }
}, {
    tableName: 'nota',
    timestamps: false
});

Student.hasMany(Nota, { foreignKey: 'student_id' });
Nota.belongsTo(Student, { foreignKey: 'student_id' });

Curs.hasMany(Nota, { foreignKey: 'curs_id' });
Nota.belongsTo(Curs, { foreignKey: 'curs_id' });

module.exports = Nota;