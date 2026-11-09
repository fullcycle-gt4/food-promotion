import { Router } from "express";
import { PostController } from "../controllers/PostController";

const postController = new PostController();
const postRoutes = Router();

postRoutes.get("/", postController.list);
postRoutes.get("/:id", postController.getById);
postRoutes.post("/", postController.create);
postRoutes.put("/:id", postController.update);
postRoutes.delete("/:id", postController.remove);

export { postRoutes };