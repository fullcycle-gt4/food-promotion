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

export { prisma };