import type { PrismaClient } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

export type CreatePostData = {
  title: string;
  authorId: number;
  content?: string | null;
  published?: boolean;
};

export type UpdatePostData = Partial<CreatePostData>;

export class PostService {
  constructor(private readonly database: PrismaClient = prisma) {}

  list() {
    return this.database.post.findMany({
      include: { author: true },
      orderBy: { id: "asc" },
    });
  }

  findById(id: number) {
    return this.database.post.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  create(data: CreatePostData) {
    return this.database.post.create({
      data,
      include: { author: true },
    });
  }

  update(id: number, data: UpdatePostData) {
    return this.database.post.update({
      where: { id },
      data,
      include: { author: true },
    });
  }

  remove(id: number) {
    return this.database.post.delete({ where: { id } });
  }
}
