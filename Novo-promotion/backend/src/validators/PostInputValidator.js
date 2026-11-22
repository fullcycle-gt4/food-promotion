export class PostInputValidator {
    static parseId(value) {
        const id = Number(value);
        return Number.isInteger(id) && id > 0 ? id : undefined;
    }
    static parseCreate(value) {
        if (!this.isRecord(value) ||
            !this.isValidTitle(value.title) ||
            !this.isValidAuthorId(value.authorId) ||
            (value.content !== undefined && !this.isValidContent(value.content)) ||
            (value.published !== undefined && typeof value.published !== "boolean")) {
            return undefined;
        }
        return {
            title: value.title.trim(),
            authorId: value.authorId,
            ...(value.content === undefined ? {} : { content: value.content }),
            ...(value.published === undefined ? {} : { published: value.published }),
        };
    }
    static parseUpdate(value) {
        if (!this.isRecord(value) ||
            Object.keys(value).length === 0 ||
            (value.title !== undefined && !this.isValidTitle(value.title)) ||
            (value.content !== undefined && !this.isValidContent(value.content)) ||
            (value.published !== undefined && typeof value.published !== "boolean") ||
            (value.authorId !== undefined && !this.isValidAuthorId(value.authorId))) {
            return undefined;
        }
        return {
            ...(value.title === undefined ? {} : { title: value.title.trim() }),
            ...(value.content === undefined ? {} : { content: value.content }),
            ...(value.published === undefined ? {} : { published: value.published }),
            ...(value.authorId === undefined ? {} : { authorId: value.authorId }),
        };
    }
    static isRecord(value) {
        return typeof value === "object" && value !== null && !Array.isArray(value);
    }
    static isValidTitle(value) {
        return typeof value === "string" && value.trim().length > 0;
    }
    static isValidContent(value) {
        return value === null || typeof value === "string";
    }
    static isValidAuthorId(value) {
        return typeof value === "number" && Number.isInteger(value) && value > 0;
    }
}
//# sourceMappingURL=PostInputValidator.js.map