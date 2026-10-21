
import { app } from "./lib/app";

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT deve ser um número entre 1 e 65535.");
}

app.listen(port, () => {
  console.log(`Backend Prisma ouvindo em http://localhost:${port}`);
});