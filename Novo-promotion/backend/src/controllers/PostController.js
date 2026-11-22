import { PostInputValidator } from "../validators/PostInputValidator.js";
import { PostService } from "../services/PostService.js";
export class PostController {
    postService;
    constructor(postService = new PostService()) {
        this.postService = postService;
    }
    list = async (_request, response) => {
        response.json(await this.postService.list());
    };
    getById = async (request, response) => {
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
    create = async (request, response) => {
        const input = PostInputValidator.parseCreate(request.body);
        if (!input) {
            response.status(400).json({
                error: "Informe title, authorId válido e valores válidos para content e published.",
            });
            return;
        }
        response.status(201).json(await this.postService.create(input));
    };
    update = async (request, response) => {
        const id = PostInputValidator.parseId(request.params.id);
        const input = PostInputValidator.parseUpdate(request.body);
        if (id === undefined || !input) {
            response.status(400).json({ error: "Id ou dados de atualização inválidos." });
            return;
        }
        response.json(await this.postService.update(id, input));
    };
    remove = async (request, response) => {
        const id = PostInputValidator.parseId(request.params.id);
        if (id === undefined) {
            response.status(400).json({ error: "O id deve ser um inteiro positivo." });
            return;
        }
        await this.postService.remove(id);
        response.status(204).end();
    };
}
//# sourceMappingURL=PostController.js.map