import { UserInputValidator } from "../validators/UserInputValidator.js";
import { UserService } from "../services/UserService.js";
export class UserController {
    userService;
    constructor(userService = new UserService()) {
        this.userService = userService;
    }
    list = async (_request, response) => {
        response.json(await this.userService.list());
    };
    getById = async (request, response) => {
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
    create = async (request, response) => {
        const input = UserInputValidator.parseCreate(request.body);
        if (!input) {
            response.status(400).json({
                error: "Informe um e-mail válido e, opcionalmente, um nome textual ou nulo.",
            });
            return;
        }
        response.status(201).json(await this.userService.create(input));
    };
    update = async (request, response) => {
        const id = UserInputValidator.parseId(request.params.id);
        const input = UserInputValidator.parseUpdate(request.body);
        if (id === undefined || !input) {
            response.status(400).json({ error: "Id ou dados de atualização inválidos." });
            return;
        }
        response.json(await this.userService.update(id, input));
    };
    remove = async (request, response) => {
        const id = UserInputValidator.parseId(request.params.id);
        if (id === undefined) {
            response.status(400).json({ error: "O id deve ser um inteiro positivo." });
            return;
        }
        await this.userService.remove(id);
        response.status(204).end();
    };
}
//# sourceMappingURL=UserController.js.map