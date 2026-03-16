import { Prisma } from "@prisma/client";
import { logHandledError } from "./logging.middleware.js";
import { createHttpError, sendError } from "../utils/response.js";

const isJsonSyntaxError = (error) =>
  error instanceof SyntaxError && error.status === 400 && "body" in error;

const normalizeError = (error) => {
  if (isJsonSyntaxError(error)) {
    return {
      statusCode: 400,
      message: "Invalid JSON payload",
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(", ")
        : error.meta?.target ?? "field";

      return {
        statusCode: 409,
        message: `A record with this ${target} already exists.`,
      };
    }

    if (error.code === "P2025") {
      return {
        statusCode: 404,
        message: "The requested record was not found.",
      };
    }

    if (error.code === "P2003") {
      return {
        statusCode: 400,
        message: "Related record not found.",
      };
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: "Invalid data sent to the database.",
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 503,
      message: "Database connection failed.",
    };
  }

  return {
    statusCode: error.statusCode ?? error.status ?? 500,
    message: error.message ?? "Internal server error",
    details: error.details,
  };
};

const notFoundHandler = (req, res, next) => {
  next(createHttpError(404, "Route not found"));
};

const globalErrorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const normalizedError = normalizeError(error);
  logHandledError(req, normalizedError.statusCode, normalizedError.message, error);

  if (normalizedError.statusCode >= 500) {
    return sendError(res, normalizedError.statusCode, "Internal server error");
  }

  return sendError(
    res,
    normalizedError.statusCode,
    normalizedError.message,
    normalizedError.details,
  );
};

export { globalErrorHandler, notFoundHandler };