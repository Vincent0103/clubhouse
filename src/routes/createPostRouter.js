import { Router } from "express";
import createPostController from "../controllers/createPostController";

const createPostRouter = Router();

createPostRouter.get("/", createPostController.createPostGet);
createPostRouter.post("/", createPostController.createPostPost);

export default createPostRouter;
