import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  completeTodo
} from "../controllers/todo.controller.js";

const todoRouter = express.Router();

todoRouter.use(authenticateUser);

todoRouter.get("/", getTodos);
todoRouter.post("/", createTodo);
todoRouter.patch("/:id", updateTodo);
todoRouter.patch("/:id/complete", completeTodo);

todoRouter.delete("/:id", deleteTodo);

export { todoRouter };