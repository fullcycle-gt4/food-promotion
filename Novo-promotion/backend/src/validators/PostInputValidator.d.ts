import type { CreatePostData, UpdatePostData } from "../services/PostService.js";
export declare class PostInputValidator {
    static parseId(value: string): number | undefined;
    static parseCreate(value: unknown): CreatePostData | undefined;
    static parseUpdate(value: unknown): UpdatePostData | undefined;
    private static isRecord;
    private static isValidTitle;
    private static isValidContent;
    private static isValidAuthorId;
}
//# sourceMappingURL=PostInputValidator.d.ts.map