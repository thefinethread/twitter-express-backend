const express = require('express');
const authRoute = require('./routes/auth.route');
const errorMiddleware = require('./middlewares/error.middleware');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoute);

// error middleware
app.use(errorMiddleware);

const startServer = () => {
	app.listen(PORT, () => {
		console.log(`${NODE_ENV} server running on port ${PORT}`);
	});
};

module.exports = { startServer };
