import { Router } from "express";
import loginController from "../../controllers/login/loginController";
import loginClubRouter from "./loginClubRouter";
import loginAdminRouter from "./loginAdminRouter";

const loginRouter = Router();

loginRouter.use("/club", loginClubRouter);
loginRouter.use("/admin", loginAdminRouter);

loginRouter.get("/", loginController.loginGet);
loginRouter.post("/", loginController.loginPost);

export default loginRouter;
