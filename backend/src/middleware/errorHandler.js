function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const response = {
    error: {
      code: err.code || 'SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  };
  if (err.fields) response.error.fields = err.fields;

  if (status >= 500) console.error('[Error]', err);
  res.status(status).json(response);
}

module.exports = errorHandler;
