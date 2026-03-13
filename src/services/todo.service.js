import {
  createTodo,
  deleteTodo,
  getTodoByIdAndUserId,
  listTodosByUserId,
  updateTodo,
  completeTodo
} from "../repositories/todo.repository.js";
import { createHttpError } from "../utils/response.js";

const parsePositiveInt = (value, fieldName) => {
  const parsedValue = Number.parseInt(String(value), 10);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    throw createHttpError(400, `${fieldName} must be a positive integer`);
  }

  return parsedValue;
};

const validateTitle = (value) => {
  if (typeof value !== "string" || !value.trim()) {
    throw createHttpError(400, "title must be a non-empty string");
  }

  return value.trim();
};

const formatTodo = (todo) => ({
  id: todo.id,
  title: todo.title,
  completed: todo.completed,
  userId: todo.userId,
  createdAt: todo.createdAt,
  updatedAt: todo.updatedAt,
  user: todo.user,
});

const getAllTodos = async (userId) => {
  const parsedUserId = parsePositiveInt(userId, "userId");
  const todos = await listTodosByUserId(parsedUserId);
  return todos.map(formatTodo);
};

const addTodo = async (payload, userId) => {
  const title = validateTitle(payload.title);
  const parsedUserId = parsePositiveInt(userId, "userId");
  const todo = await createTodo({ title, userId: parsedUserId });
  return formatTodo(todo);
};

const completeTodoService = async (id, completed, userId) => {
  const todoId = parsePositiveInt(id, "todoId");
  const parsedUserId = parsePositiveInt(userId, "userId");
  const existingTodo = await getTodoByIdAndUserId(todoId, parsedUserId);

  if (!existingTodo) {
    throw createHttpError(404, "Todo not found");
  }

  const todo = await completeTodo(todoId, completed);
  return formatTodo(todo);
}

const editTodo = async (id, payload, userId) => {
  const todoId = parsePositiveInt(id, "todoId");
  const parsedUserId = parsePositiveInt(userId, "userId");
  const existingTodo = await getTodoByIdAndUserId(todoId, parsedUserId);

  if (!existingTodo) {
    throw createHttpError(404, "Todo not found");
  }

  const updates = {};

  if (Object.prototype.hasOwnProperty.call(payload, "title")) {
    updates.title = validateTitle(payload.title);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError(400, "Provide title to update");
  }

  const todo = await updateTodo(todoId, updates);
  return formatTodo(todo);
};

const removeTodo = async (id, userId) => {
  const todoId = parsePositiveInt(id, "todoId");
  const parsedUserId = parsePositiveInt(userId, "userId");
  const todo = await getTodoByIdAndUserId(todoId, parsedUserId);

  if (!todo) {
    throw createHttpError(404, "Todo not found");
  }

  await deleteTodo(todoId);
};

export { addTodo, editTodo, getAllTodos, removeTodo, completeTodoService };