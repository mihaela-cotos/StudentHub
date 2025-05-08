const { Sequelize } = require('sequelize');
require('dotenv').config();  // importam datele din .env

const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    logging: false,
});

module.exports = sequelize;

