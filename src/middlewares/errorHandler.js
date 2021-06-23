class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (req, res, err) => {
  console.log('inside of handle error:', err);
  const { statusCode, message } = err;
  res.json({
    statusCode,
    message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
