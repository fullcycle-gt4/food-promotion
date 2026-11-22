import type { PrismaClient } from "../../generated/prisma/client.js";
export type CreatePostData = {
    title: string;
    authorId: number;
    content?: string | null;
    published?: boolean;
};
export type UpdatePostData = Partial<CreatePostData>;
export declare class PostService {
    private readonly database;
    constructor(database?: PrismaClient);
    list(): any;
    findById(id: number): any;
    create(data: CreatePostData): any;
    update(id: number, data: UpdatePostData): any;
    remove(id: number): any;
}
//# sourceMappingURL=PostService.d.ts.map