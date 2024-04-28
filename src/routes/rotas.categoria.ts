import { Router } from "express";
import categoriaController from "../controller/categoria.controller";

const categoriaRouter = Router();

categoriaRouter.post('/categoria', categoriaController.create);
categoriaRouter.get('/categoria/:id', categoriaController.findById);
categoriaRouter.get('/categoria/', categoriaController.findAll);
categoriaRouter.put('/categoria/:id', categoriaController.update);
categoriaRouter.delete('/categoria/:id', categoriaController.delete);
categoriaRouter.get('/categoria/user/:id', categoriaController.findByUser);

export default categoriaRouter;