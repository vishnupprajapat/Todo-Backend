import { login, register } from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";

const registerUser = async (req, res) => {
  const user = await register(req.body);
  return sendSuccess(res, 201, user, "User registered successfully");
};

const loginUser = async (req, res) => {
  const user = await login(req.body);
  return sendSuccess(res, 200, user, "Login successful");
};

export { loginUser, registerUser };