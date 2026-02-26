const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'notes_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'postgres',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 20,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    }
);

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL');

        // Sync models
        await sequelize.sync({ alter: true });
        console.log('Database synced');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDb };
