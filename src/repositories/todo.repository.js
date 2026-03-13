import { prisma } from "../config/db.js";

const todoInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

const listTodosByUserId = (userId) =>
  prisma.todo.findMany({
    where: { userId },
    include: todoInclude,
    orderBy: {
      createdAt: "desc",
    },
  });

const getTodoByIdAndUserId = (id, userId) =>
  prisma.todo.findUnique({
    where: { id, userId },
    include: todoInclude,
  });

const createTodo = ({ title, userId }) =>
  prisma.todo.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
    include: todoInclude,
  });

const updateTodo = (id, data) => prisma.todo.update({ where: { id }, data, include: todoInclude });
  const completeTodo =(id, completed)=>{
    return prisma.todo.update({
      where:{id},
      data:{
        completed
      },
      include: todoInclude
    })
  }


const deleteTodo = (id) => prisma.todo.delete({ where: { id } });

export {
  createTodo,
  deleteTodo,
  getTodoByIdAndUserId,
  listTodosByUserId,
  updateTodo,
  completeTodo
};