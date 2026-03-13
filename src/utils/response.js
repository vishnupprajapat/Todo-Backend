const sendSuccess = (res, statusCode, data, message) => {
  const payload = { success: true };

  if (message) {
    payload.message = message;
  }

  if (typeof data !== "undefined") {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const sendError = (res, statusCode, message, details) => {
  const payload = {
    success: false,
    message,
  };

  if (typeof details !== "undefined") {
    payload.details = details;
  }

  return res.status(statusCode).json(payload);
};

const createHttpError = (statusCode, message, details) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};

export { createHttpError, sendError, sendSuccess };