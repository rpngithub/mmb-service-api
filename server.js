require('dotenv').config();
const app = require('./app');
const sequelize = require('./src/models/index');

const PORT = process.env.PORT || 3000;

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
    module.exports = app;
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
