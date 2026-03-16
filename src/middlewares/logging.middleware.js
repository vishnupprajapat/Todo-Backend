const requestLogger = (req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
};

const logHandledError = (req, statusCode, message, error) => {
  const logMethod = statusCode >= 500 ? console.error : console.warn;

  logMethod(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`, error);
};

export { logHandledError, requestLogger };