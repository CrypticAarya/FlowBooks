export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error console for developer visibility
  console.error(`🚨 Backend Error: ${err.message}`);

  // Mongoose Bad ObjectID format
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Resource not found: invalid ID format',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate value entered',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(', '),
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error',
  });
};
