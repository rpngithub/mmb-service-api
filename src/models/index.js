const { Sequelize } = require('sequelize');
const pg = require('pg');

if ((process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') && process.env.DB_URL) {
  console.log('Using production database');
  const sequelize = new Sequelize(
    process.env.DB_URL,
    {
      dialect: 'postgres',
      protocol: 'postgres',
      logging: false,
      dialectModule: pg,

      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
  module.exports = sequelize;
} else {
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
  module.exports = sequelize;
}

