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

const logServiceError = (operation, metadata, error) => {
  console.error(`[TodoService] ${operation} failed`, {
    ...metadata,
    message: error?.message,
  });
};

const getAllTodos = async (userId) => {
  try {
    const parsedUserId = parsePositiveInt(userId, "userId");
    const todos = await listTodosByUserId(parsedUserId);
    console.log(`[TodoService] Todos fetched for user ${parsedUserId}`, {
      count: todos.length,
    });
    return todos.map(formatTodo);
  } catch (error) {
    logServiceError("getAllTodos", { userId }, error);
    throw error;
  }
};

const addTodo = async (payload, userId) => {
  try {
    const title = validateTitle(payload.title);
    const parsedUserId = parsePositiveInt(userId, "userId");
    const todo = await createTodo({ title, userId: parsedUserId });
    console.log(`[TodoService] Todo created for user ${parsedUserId}`, {
      todoId: todo.id,
      title: todo.title,
    });
    return formatTodo(todo);
  } catch (error) {
    logServiceError("addTodo", { userId, title: payload?.title }, error);
    throw error;
  }
};

const completeTodoService = async (id, completed, userId) => {
  try {
    const todoId = parsePositiveInt(id, "todoId");
    const parsedUserId = parsePositiveInt(userId, "userId");
    const existingTodo = await getTodoByIdAndUserId(todoId, parsedUserId);

    if (!existingTodo) {
      throw createHttpError(404, "Todo not found");
    }

    const todo = await completeTodo(todoId, completed);
    console.log(`[TodoService] Todo completion updated for user ${parsedUserId}`, {
      todoId: todo.id,
      completed: todo.completed,
    });
    return formatTodo(todo);
  } catch (error) {
    logServiceError("completeTodoService", { id, completed, userId }, error);
    throw error;
  }
};

const editTodo = async (id, payload, userId) => {
  try {
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
    console.log(`[TodoService] Todo edited for user ${parsedUserId}`, {
      todoId: todo.id,
      updatedFields: Object.keys(updates),
    });
    return formatTodo(todo);
  } catch (error) {
    logServiceError("editTodo", { id, userId }, error);
    throw error;
  }
};

const removeTodo = async (id, userId) => {
  try {
    const todoId = parsePositiveInt(id, "todoId");
    const parsedUserId = parsePositiveInt(userId, "userId");
    const todo = await getTodoByIdAndUserId(todoId, parsedUserId);

    if (!todo) {
      throw createHttpError(404, "Todo not found");
    }

    await deleteTodo(todoId);
    console.log(`[TodoService] Todo deleted for user ${parsedUserId}`, {
      todoId,
    });
  } catch (error) {
    logServiceError("removeTodo", { id, userId }, error);
    throw error;
  }
};

export { addTodo, editTodo, getAllTodos, removeTodo, completeTodoService };