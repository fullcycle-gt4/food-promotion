import { prisma } from "../config/prisma.js";
export class UserService {
    database;
    constructor(database = prisma) {
        this.database = database;
    }
    list() {
        return this.database.user.findMany({
            include: { posts: true },
            orderBy: { id: "asc" },
        });
    }
    findById(id) {
        return this.database.user.findUnique({
            where: { id },
            include: { posts: true },
        });
    }
    create(data) {
        return this.database.user.create({ data });
    }
    update(id, data) {
        return this.database.user.update({ where: { id }, data });
    }
    remove(id) {
        return this.database.user.delete({ where: { id } });
    }
}
//# sourceMappingURL=UserService.js.map