import { Router } from "express";
import usuarioController from "../controller/usuario.controller";
const userRouter = Router();

userRouter.post('/usuario/signup', usuarioController.signup);
userRouter.post('/usuario/login', usuarioController.login);

userRouter.post('/usuario', usuarioController.create);
userRouter.get('/usuario/', usuarioController.findAll);
userRouter.get('/usuario/:id', usuarioController.findById);
userRouter.put('/usuario/:id', usuarioController.update);
userRouter.delete('/usuario/:id', usuarioController.delete);

export default userRouter;