require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || '787898',
    database: process.env.DB_NAME || 'csm-bd',
    host: process.env.DB_HOST || '127.0.0.1', 
    dialect: 'postgres'
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || 'db',
    dialect: 'postgres'
  }
};
