import type { RequestHandler } from "express";
import { PostInputValidator } from "../validators/PostInputValidator";
import { PostService } from "../services/PostService";

export class PostController {
  constructor(private readonly postService = new PostService()) {}

  readonly list: RequestHandler = async (_request, response) => {
    response.json(await this.postService.list());
  };

  readonly getById: RequestHandler<{ id: string }> = async (request, response) => {
    const id = PostInputValidator.parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    const post = await this.postService.findById(id);
    if (!post) {
      response.status(404).json({ error: "Publicação não encontrada." });
      return;
    }
    response.json(post);
  };

  readonly create: RequestHandler = async (request, response) => {
    const input = PostInputValidator.parseCreate(request.body);
    if (!input) {
      response.status(400).json({
        error: "Informe title, authorId válido e valores válidos para content e published.",
      });
      return;
    }

    response.status(201).json(await this.postService.create(input));
  };

  readonly update: RequestHandler<{ id: string }> = async (request, response) => {
    const id = PostInputValidator.parseId(request.params.id);
    const input = PostInputValidator.parseUpdate(request.body);
    if (id === undefined || !input) {
      response.status(400).json({ error: "Id ou dados de atualização inválidos." });
      return;
    }

    response.json(await this.postService.update(id, input));
  };

  readonly remove: RequestHandler<{ id: string }> = async (request, response) => {
    const id = PostInputValidator.parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    await this.postService.remove(id);
    response.status(204).end();
  };
}