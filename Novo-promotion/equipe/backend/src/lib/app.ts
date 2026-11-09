import express, { type ErrorRequestHandler } from "express";
import { Prisma } from "../../generated/prisma/client";
import { postRoutes } from "../routes/post.routes";
import { userRoutes } from "../routes/user.routes";

const app = express();

app.use(express.json());
app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use((_request, response) => {
  response.status(404).json({ error: "Rota não encontrada." });
});

const handleError: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      response.status(409).json({ error: "O e-mail informado já está cadastrado." });
      return;
    }
    if (error.code === "P2025") {
      response.status(404).json({ error: "Registro não encontrado." });
      return;
    }
    if (error.code === "P2003") {
      response.status(409).json({
        error: "A operação não pode ser concluída porque há registros relacionados.",
      });
      return;
    }
  }

  console.error("Falha ao processar a requisição.", error);
  response.status(500).json({ error: "Erro interno do servidor." });
};

app.use(handleError);

export { app };