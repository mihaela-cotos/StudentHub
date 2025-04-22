const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,       // nume baza de date
    process.env.DB_USER,       // utilizator
    process.env.DB_PASS,       // parola
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

module.exports = sequelize;
