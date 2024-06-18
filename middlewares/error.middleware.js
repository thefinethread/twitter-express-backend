const errorMiddleware = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	const message = err.message;

	res.status(statusCode).json({
		message,
		success: false,
		stack: process.env.NODE_ENV === 'development' ? err.stack : null,
	});

	next();
};

module.exports = errorMiddleware;
