import type { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export type CreateUserData = {
  email: string;
  name?: string | null;
};

export type UpdateUserData = Partial<CreateUserData>;

export class UserService {
  constructor(private readonly database: PrismaClient = prisma) {}

  list() {
    return this.database.user.findMany({
      include: { posts: true },
      orderBy: { id: "asc" },
    });
  }

  findById(id: number) {
    return this.database.user.findUnique({
      where: { id },
      include: { posts: true },
    });
  }

  create(data: CreateUserData) {
    return this.database.user.create({ data });
  }

  update(id: number, data: UpdateUserData) {
    return this.database.user.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.database.user.delete({ where: { id } });
  }
}
