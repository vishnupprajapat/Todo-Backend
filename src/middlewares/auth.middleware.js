import jwt from "jsonwebtoken";
import { createHttpError } from "../utils/response.js";

const authenticateUser = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return next(createHttpError(401, "Authorization header is required"));
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(createHttpError(401, "Authorization token must use Bearer scheme"));
  }

  const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

  try {
    const payload = jwt.verify(token, jwtSecret);

    if (!payload || typeof payload !== "object" || typeof payload.userId !== "number") {
      return next(createHttpError(401, "Invalid token payload"));
    }

    req.auth = {
      userId: payload.userId,
      email: payload.email,
    };

    return next();
  } catch {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};

export { authenticateUser };
