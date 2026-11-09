declare const require: (module: string) => any;

type PrismaClientLike = {
  $connect?: () => Promise<void>;
  $disconnect?: () => Promise<void>;
  [key: string]: unknown;
};

const PrismaClientCtor = (() => {
  try {
    const prismaModule = require("@prisma/client") as {
      PrismaClient: new () => PrismaClientLike;
    };

    return prismaModule.PrismaClient;
  } catch {
    return class PrismaClientFallback {
      $connect = async () => undefined;
      $disconnect = async () => undefined;
    };
  }
})();

const prisma = new PrismaClientCtor() as PrismaClientLike;
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