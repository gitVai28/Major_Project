const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // Disable SQL logging
  }
);

sequelize
  .authenticate()
  .then(() => console.log('PostgreSQL connected via Sequelize'))
  .catch(err => console.error('Unable to connect:', err));

module.exports = sequelize;
