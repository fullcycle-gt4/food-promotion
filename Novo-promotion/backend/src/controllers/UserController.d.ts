import type { RequestHandler } from "express";
import { UserService } from "../services/UserService.js";
export declare class UserController {
    private readonly userService;
    constructor(userService?: UserService);
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
//# sourceMappingURL=UserController.d.ts.map