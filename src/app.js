import express from "express";
import { todoRouter } from "./routes/todo.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { sendError, sendSuccess } from "./utils/response.js";
 import cors from "cors";
const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}
));
app.use(express.json());
app.get("/", (req, res) =>
  sendSuccess(
    res,
    200,
    {
      todos: "/api/todos",
      users: "/api/user",
    },
    "Todo backend is running",
  ),
);

app.use("/api/todos", todoRouter);
app.use("/api/user", userRouter);

app.use((req, res) => sendError(res, 404, "Route not found"));

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const statusCode = error.statusCode ?? 500;
  const message = error.message ?? "Internal server error";
  return sendError(res, statusCode, message, error.details);
});

export { app };