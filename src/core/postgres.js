const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_DB,      // database name
  process.env.PG_USER,    // username
  process.env.PG_PASSWORD,// password
  {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL réussie');
  } catch (err) {
    console.error('❌ Erreur de connexion PostgreSQL :', err);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
