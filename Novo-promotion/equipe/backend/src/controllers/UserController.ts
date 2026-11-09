import type { RequestHandler } from "express";
import { UserInputValidator } from "../validators/UserInputValidator";
import { UserService } from "../services/UserService";

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  readonly list: RequestHandler = async (_request, response) => {
    response.json(await this.userService.list());
  };

  readonly getById: RequestHandler<{ id: string }> = async (request, response) => {
    const id = UserInputValidator.parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    const user = await this.userService.findById(id);
    if (!user) {
      response.status(404).json({ error: "Usuário não encontrado." });
      return;
    }
    response.json(user);
  };

  readonly create: RequestHandler = async (request, response) => {
    const input = UserInputValidator.parseCreate(request.body);
    if (!input) {
      response.status(400).json({
        error: "Informe um e-mail válido e, opcionalmente, um nome textual ou nulo.",
      });
      return;
    }

    response.status(201).json(await this.userService.create(input));
  };

  readonly update: RequestHandler<{ id: string }> = async (request, response) => {
    const id = UserInputValidator.parseId(request.params.id);
    const input = UserInputValidator.parseUpdate(request.body);
    if (id === undefined || !input) {
      response.status(400).json({ error: "Id ou dados de atualização inválidos." });
      return;
    }

    response.json(await this.userService.update(id, input));
  };

  readonly remove: RequestHandler<{ id: string }> = async (request, response) => {
    const id = UserInputValidator.parseId(request.params.id);
    if (id === undefined) {
      response.status(400).json({ error: "O id deve ser um inteiro positivo." });
      return;
    }

    await this.userService.remove(id);
    response.status(204).end();
  };
}
