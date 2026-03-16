import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import yaml from "yaml";
import { requestLogger } from "./middlewares/logging.middleware.js";
import { todoRouter } from "./routes/todo.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { globalErrorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { sendSuccess } from "./utils/response.js";
import fs from "fs";


const file = fs.readFileSync('./src/docs/swagger.yaml', 'utf8')
const swaggerDocument = yaml.parse(file)

const app = express();

app.use(requestLogger);
app.use(cors({ origin: "http://localhost:5173", credentials: true, }));
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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };