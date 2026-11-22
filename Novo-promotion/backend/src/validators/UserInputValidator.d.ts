import type { CreateUserData, UpdateUserData } from "../services/UserService.js";
export declare class UserInputValidator {
    static parseId(value: string): number | undefined;
    static parseCreate(value: unknown): CreateUserData | undefined;
    static parseUpdate(value: unknown): UpdateUserData | undefined;
    private static isRecord;
    private static isValidEmail;
    private static isValidName;
}
//# sourceMappingURL=UserInputValidator.d.ts.map