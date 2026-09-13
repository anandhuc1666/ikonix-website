import { Router } from "express";

import {loginAdmin_User} from "../controller/authController.js";

const authRouter = Router();

authRouter.post("/login", loginAdmin_User);

export default authRouter;