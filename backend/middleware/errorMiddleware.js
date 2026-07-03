const { sendResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return sendResponse(res, statusCode, false, message);
};

module.exports = { errorHandler };
