require('dotenv').config();
const { startServer } = require('./app');
const setupDb = require('./db/db.setup');

setupDb();

startServer();
