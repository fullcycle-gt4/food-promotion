import type { CreatePostData, UpdatePostData } from "../services/PostService";

export class PostInputValidator {
  static parseId(value: string): number | undefined {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : undefined;
  }

  static parseCreate(value: unknown): CreatePostData | undefined {
    if (
      !this.isRecord(value) ||
      !this.isValidTitle(value.title) ||
      !this.isValidAuthorId(value.authorId) ||
      (value.content !== undefined && !this.isValidContent(value.content)) ||
      (value.published !== undefined && typeof value.published !== "boolean")
    ) {
      return undefined;
    }

    return {
      title: value.title.trim(),
      authorId: value.authorId,
      ...(value.content === undefined ? {} : { content: value.content }),
      ...(value.published === undefined ? {} : { published: value.published }),
    };
  }

  static parseUpdate(value: unknown): UpdatePostData | undefined {
    if (
      !this.isRecord(value) ||
      Object.keys(value).length === 0 ||
      (value.title !== undefined && !this.isValidTitle(value.title)) ||
      (value.content !== undefined && !this.isValidContent(value.content)) ||
      (value.published !== undefined && typeof value.published !== "boolean") ||
      (value.authorId !== undefined && !this.isValidAuthorId(value.authorId))
    ) {
      return undefined;
    }

    return {
      ...(value.title === undefined ? {} : { title: value.title.trim() }),
      ...(value.content === undefined ? {} : { content: value.content }),
      ...(value.published === undefined ? {} : { published: value.published }),
      ...(value.authorId === undefined ? {} : { authorId: value.authorId }),
    };
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private static isValidTitle(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
  }

  private static isValidContent(value: unknown): value is string | null {
    return value === null || typeof value === "string";
  }

  private static isValidAuthorId(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value > 0;
  }
}
