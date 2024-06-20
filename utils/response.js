module.exports = ({ message, data }) => {
	return {
		message: message || 'OK',
		data: data,
		success: true,
	};
};
