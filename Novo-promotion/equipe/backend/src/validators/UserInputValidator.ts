import type { CreateUserData, UpdateUserData } from "../services/UserService";

export class UserInputValidator {
  static parseId(value: string): number | undefined {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : undefined;
  }

  static parseCreate(value: unknown): CreateUserData | undefined {
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

  static parseUpdate(value: unknown): UpdateUserData | undefined {
    if (
      !this.isRecord(value) ||
      Object.keys(value).length === 0 ||
      (value.email !== undefined && !this.isValidEmail(value.email)) ||
      (value.name !== undefined && !this.isValidName(value.name))
    ) {
      return undefined;
    }

    return {
      ...(value.email === undefined ? {} : { email: value.email }),
      ...(value.name === undefined ? {} : { name: value.name }),
    };
  }

  private static isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  private static isValidEmail(value: unknown): value is string {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  private static isValidName(value: unknown): value is string | null {
    return value === null || typeof value === "string";
  }
}
