const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Camin = require('./Camin');
const Student = require('./Student');

// Tabela Cazare din DB
const Cazare = sequelize.define('Cazare', {
    cazare_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    camin_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Camin,
            key: 'camin_id'
        }
    },
    student_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Student,
            key: 'student_id'
        }
    },
    nr_camera: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    colegi_camera: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: true
    }
}, {
    tableName: 'cazare',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'nr_camera']
        }
    ]
});

Camin.hasMany(Cazare, { foreignKey: 'camin_id' });
Cazare.belongsTo(Camin, { foreignKey: 'camin_id' });

Student.hasOne(Cazare, { foreignKey: 'student_id' });
Cazare.belongsTo(Student, { foreignKey: 'student_id' });

module.exports = Cazare;