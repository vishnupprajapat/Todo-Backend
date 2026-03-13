import { prisma } from "../config/db.js";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
};

const createUser = ({ name, email, password }) =>
  prisma.user.create({
    data: {
      name,
      email,
      password,
    },
    select: publicUserSelect,
  });

const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
    select: publicUserSelect,
  });

const findUserByEmailWithPassword = (email) =>
  prisma.user.findUnique({
    where: { email },
  });


export { createUser, findUserByEmail, findUserByEmailWithPassword };