import { Router } from "express";
import { UserController } from "../controllers/UserController";

const userController = new UserController();
const userRoutes = Router();

userRoutes.get("/", userController.list);
userRoutes.get("/:id", userController.getById);
userRoutes.post("/", userController.create);
userRoutes.put("/:id", userController.update);
userRoutes.delete("/:id", userController.remove);

export { userRoutes };