import {
  addTodo,
  completeTodoService,
  editTodo,
  getAllTodos,
  removeTodo,
} from "../services/todo.service.js";
import { createHttpError, sendSuccess } from "../utils/response.js";

const getTodos = async (req, res) => {
  const todos = await getAllTodos(req.auth.userId);
  return sendSuccess(res, 200, todos, "Todos fetched successfully");
};

const createTodo = async (req, res) => {
  const todo = await addTodo(req.body, req.auth.userId);
  return sendSuccess(res, 201, todo, "Todo created successfully");
};

const updateTodo = async (req, res) => {
  const todo = await editTodo(req.params.id, req.body, req.auth.userId);
  return sendSuccess(res, 200, todo, "Todo updated successfully");
};

const completeTodo = async (req, res) => {
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    throw createHttpError(400, "Completed status must be a boolean");
  }

  const todo = await completeTodoService(req.params.id, completed, req.auth.userId);
  const message = completed ? "Todo marked as completed" : "Todo marked as incomplete";

  return sendSuccess(res, 200, todo, message);
};

const deleteTodo = async (req, res) => {
  await removeTodo(req.params.id, req.auth.userId);
  return sendSuccess(res, 200, null, "Todo deleted successfully");
};

export { createTodo, deleteTodo, getTodos, updateTodo, completeTodo };