import type { PrismaClient } from "../../generated/prisma/client.js";
export type CreateUserData = {
    email: string;
    name?: string | null;
};
export type UpdateUserData = Partial<CreateUserData>;
export declare class UserService {
    private readonly database;
    constructor(database?: PrismaClient);
    list(): any;
    findById(id: number): any;
    create(data: CreateUserData): any;
    update(id: number, data: UpdateUserData): any;
    remove(id: number): any;
}
//# sourceMappingURL=UserService.d.ts.map