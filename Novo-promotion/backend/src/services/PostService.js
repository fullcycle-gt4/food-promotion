import { prisma } from "../config/prisma.js";
export class PostService {
    database;
    constructor(database = prisma) {
        this.database = database;
    }
    list() {
        return this.database.post.findMany({
            include: { author: true },
            orderBy: { id: "asc" },
        });
    }
    findById(id) {
        return this.database.post.findUnique({
            where: { id },
            include: { author: true },
        });
    }
    create(data) {
        return this.database.post.create({
            data,
            include: { author: true },
        });
    }
    update(id, data) {
        return this.database.post.update({
            where: { id },
            data,
            include: { author: true },
        });
    }
    remove(id) {
        return this.database.post.delete({ where: { id } });
    }
}
//# sourceMappingURL=PostService.js.map