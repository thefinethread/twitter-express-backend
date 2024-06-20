const Objection = require('objection');

const errorMiddleware = (err, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	let message = err.message;

	if (err instanceof Objection.ValidationError) {
		message = validationError(err.data);
	}

	res.status(statusCode).json({
		message,
		success: false,
		stack: process.env.NODE_ENV === 'development' ? err.stack : null,
	});

	next();
};

const validationError = (data) => {
	let errObj = {};

	Object.keys(data).forEach((key) => {
		errObj[key] = data[key][0].message;
	});

	return errObj;
};

module.exports = errorMiddleware;
