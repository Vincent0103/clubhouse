import { Router } from "express";
import deleteMessageController from "../controllers/deleteMessageController";

const deleteMessageRouter = Router();
deleteMessageRouter.post(
  "/:messageId",
  deleteMessageController.deleteMessagePost,
);

export default deleteMessageRouter;
