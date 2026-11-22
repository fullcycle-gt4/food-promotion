export class UserInputValidator {
    static parseId(value) {
        const id = Number(value);
        return Number.isInteger(id) && id > 0 ? id : undefined;
    }
    static parseCreate(value) {
        if (!this.isRecord(value) || !this.isValidEmail(value.email)) {
            return undefined;
        }
        if (value.name !== undefined && !this.isValidName(value.name)) {
            return undefined;
        }
        return {
            email: value.email,
            ...(value.name === undefined ? {} : { name: value.name }),
        };
    }
    static parseUpdate(value) {
        if (!this.isRecord(value) ||
            Object.keys(value).length === 0 ||
            (value.email !== undefined && !this.isValidEmail(value.email)) ||
            (value.name !== undefined && !this.isValidName(value.name))) {
            return undefined;
        }
        return {
            ...(value.email === undefined ? {} : { email: value.email }),
            ...(value.name === undefined ? {} : { name: value.name }),
        };
    }
    static isRecord(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    static isValidEmail(value) {
        return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    static isValidName(value) {
        return value === null || typeof value === "string";
    }
}
//# sourceMappingURL=UserInputValidator.js.map