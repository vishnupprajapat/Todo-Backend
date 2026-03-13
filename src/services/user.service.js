import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
} from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHttpError } from "../utils/response.js";

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const verifyPassword = async (password, storedHash) => {
	if (typeof storedHash !== "string") {
		return false;
	}

	return bcrypt.compare(password, storedHash);
};

const validateName = (value) => {
  if (typeof value === "undefined") {
    return null;
  }

  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError(400, "name must be a non-empty string");
  }

  return value.trim();
};

const validateEmail = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError(400, "email is required");
  }

  const email = value.trim().toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    throw createHttpError(400, "email must be valid");
  }

  return email;
};

const validatePassword = (value) => {
  if (typeof value !== "string" || value.length < 8) {
    throw createHttpError(400, "password must be at least 8 characters long");
  }

  return value;
};

const formatUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = async (payload) => {
  const input = payload ?? {};
  const name = validateName(input.name);
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createHttpError(409, "A user with this email already exists");
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser({ name, email, password: passwordHash });
  return formatUser(user);
};

const login = async (payload) => {
  const input = payload ?? {};
  const email = validateEmail(input.email);
  const password = validatePassword(input.password);

  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    jwtSecret,
    {
      expiresIn: "1d",
    },
  );

  return {
    user: formatUser(user),
    token,
  };
};

export { login, register };

