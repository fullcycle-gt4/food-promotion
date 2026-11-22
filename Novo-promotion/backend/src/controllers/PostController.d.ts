import type { RequestHandler } from "express";
import { PostService } from "../services/PostService.js";
export declare class PostController {
    private readonly postService;
    constructor(postService?: PostService);
    readonly list: RequestHandler;
    readonly getById: RequestHandler<{
        id: string;
    }>;
    readonly create: RequestHandler;
    readonly update: RequestHandler<{
        id: string;
    }>;
    readonly remove: RequestHandler<{
        id: string;
    }>;
}
//# sourceMappingURL=PostController.d.ts.map