import { Router } from "express";
import loginAdminController from "../../controllers/login/loginAdminController";

const loginAdminRouter = Router();
loginAdminRouter.post("/", loginAdminController.loginAdminPost);

export default loginAdminRouter;
