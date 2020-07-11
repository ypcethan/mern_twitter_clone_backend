const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  if (err.name === 'CastError') {
    error = { success: false, statusCode: 404, message: 'Resource not found' };
  }
  if (err.code === 11000) {
    error = { success: false, statusCode: 400, message: 'Duplicate field value enter' };
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    error = { success: false, statusCode: 400, message: messages };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server error',
  });
};

module.exports = errorHandler;
