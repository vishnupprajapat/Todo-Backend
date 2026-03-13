import { login, register } from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";

const registerUser = async (req, res, next) => {
    try {
        const user = await register(req.body);
        return sendSuccess(res, 201, user, "User registered successfully");
    } catch (error) {
        return next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const user = await login(req.body);
        return sendSuccess(res, 200, user, "Login successful");
    } catch (error) {
        return next(error);
    }
};

export {loginUser, registerUser };