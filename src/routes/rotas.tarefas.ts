import { Router } from "express";
import tarefaController from "../controller/tarefa.controller";

const tarefaRouter = Router();

//post
tarefaRouter.post('/tarefa', tarefaController.create);

//get
tarefaRouter.get('/tarefa/media_conclusao', tarefaController.calculateCompletionAverage);
tarefaRouter.get('/tarefa/longest_description', tarefaController.findTaskWithLongestDescription);
tarefaRouter.get('/tarefa/agrupadas_por_categoria', tarefaController.groupTasksByCategory);
tarefaRouter.get('/tarefa/:id', tarefaController.findById);
tarefaRouter.get('/tarefa/', tarefaController.findAll);
tarefaRouter.get('/tarefa/user/:id', tarefaController.findByUser);
tarefaRouter.get('/tarefa/description/:id', tarefaController.findTaskDescription)
tarefaRouter.get('/tarefa/categoria/:categoriaId', tarefaController.findByCategory)
tarefaRouter.get('/tarefa/status/:status', tarefaController.findByStatus)
tarefaRouter.get('/tarefa/count/:userId', tarefaController.countTasksByUser)
tarefaRouter.get('/tarefa/latest/:userId', tarefaController.findLatestTaskByUser)
tarefaRouter.get('/tarefa/mais_antiga/:userId', tarefaController.findOldestTaskByUser);

//put
tarefaRouter.put('/tarefa/:id', tarefaController.update);

//delete
tarefaRouter.delete('/tarefa/:id', tarefaController.delete);







export default tarefaRouter;