module.exports = ({ message, data }) => {
	return {
		message: message || 'OK',
		data: data || null,
		success: true,
	};
};
