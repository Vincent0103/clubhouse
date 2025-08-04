import { Router } from "express";
import loginClubController from "../../controllers/login/loginClubController";

const loginClubRouter = Router();
loginClubRouter.post("/", loginClubController.loginClubPost);

export default loginClubRouter;
