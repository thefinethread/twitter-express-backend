const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const errorMiddleware = require('./middlewares/error.middleware');

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);

// error middleware
app.use(errorMiddleware);

const startServer = () => {
	app.listen(PORT, () => {
		console.log(`${NODE_ENV} server running on port ${PORT}`);
	});
};

module.exports = { startServer };
