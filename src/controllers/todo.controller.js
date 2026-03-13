import {
  addTodo,
  editTodo,
  getAllTodos,
  removeTodo,
  completeTodoService
} from "../services/todo.service.js";
import { createHttpError, sendSuccess } from "../utils/response.js";

const getTodos = async (req, res, next) => {
  try {
    const todos = await getAllTodos(req.auth.userId);
    return sendSuccess(res, 200, todos, "Todos fetched successfully");
  } catch (error) {
    return next(error);
  }
};


const createTodo = async (req, res, next) => {
  try {
    const todo = await addTodo(req.body, req.auth.userId);
    return sendSuccess(res, 201, todo, "Todo created successfully");
  } catch (error) {
    return next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await editTodo(req.params.id, req.body, req.auth.userId);
    return sendSuccess(res, 200, todo, "Todo updated successfully");
  } catch (error) {
    return next(error);
  }
};
const completeTodo = async (req, res, next) => {
  try {   
     const { completed } = req.body;
    if (typeof completed !== "boolean") {
      throw createHttpError(400, "Completed status must be a boolean");
    }
    const todo = await completeTodoService(req.params.id, completed, req.auth.userId);
    const message = completed ? "Todo marked as completed" : "Todo marked as incomplete";
    return sendSuccess(res, 200, todo, message);
  } catch (error) {
    return next(error);
  }
}

const deleteTodo = async (req, res, next) => {
  try {
    await removeTodo(req.params.id, req.auth.userId);
     return sendSuccess(res, 200, null, "Todo deleted successfully");
  } catch (error) {
    return next(error);
  }
};

export { createTodo, deleteTodo, getTodos, updateTodo, completeTodo };