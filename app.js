const express = require('express');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const errorMiddleware = require('./middlewares/error.middleware');
const setupDb = require('./db/db.setup');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

setupDb();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// error middleware
app.use(errorMiddleware);

const startServer = () => {
	app.listen(PORT, () => {
		console.log(`${NODE_ENV} server running on port ${PORT}`);
	});
};

module.exports = { startServer };
