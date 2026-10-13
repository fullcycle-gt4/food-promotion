declare const process: {
  env: Record<string, string | undefined>;
};

declare function require(id: string): any;

require("dotenv/config");

const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3") as {
  PrismaBetterSqlite3: new (options: { url: string }) => unknown;
};
const { PrismaClient } = require("../../generated/prisma/client") as {
  PrismaClient: new (options?: { adapter?: unknown }) => unknown;
};

const connectionString = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };