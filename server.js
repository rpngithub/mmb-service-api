const env = process.env.NODE_ENV || 'development';
require('dotenv').config({ path: env === 'development' ? '.env' : `.env.${env}` });
const app = require('./app');
const sequelize = require('./src/models/index');

const PORT = process.env.PORT || 3000;

module.exports = app;
console.log(`Starting server in ${env} mode...`);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected!');
    await sequelize.sync();
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
