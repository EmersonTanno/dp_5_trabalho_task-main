import { Request, Response } from 'express'
import { TarefasService } from '../services/tarefa.service'


class TarefaController {
    async create(req: Request, res: Response) {
        try {
            const tarefa = await new TarefasService().create(req.body)

            if(tarefa){
               return res.json(tarefa);
            } else {
                return res.status(401).json({ message: 'Usuário e/ou Categoria incorreto(s)' })
            }
        } catch (error : any) {
            console.error('Erro no controlador de criação:', error)
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const tarefa = await new TarefasService().findById(req.params.id)
            return res.json(tarefa)
        } catch (error){
            console.error('Erro no controlador de busca:', error)
        }
    }

    async findAll(req: Request, res: Response) {
        try{
            const tarefa = await new TarefasService().findAll()
            return res.json(tarefa)
        } catch (error){
            console.error('Erro no controlador de busca:', error)
        }
    }

    async update(req: Request, res: Response) {
        try{
            const tarefa = await new TarefasService().update(req.params.id, req.body)
            return res.json(tarefa)
        } catch (error){
            console.error('Erro no controlador de alteração:', error)
        }
    }

    async delete(req: Request, res: Response) {
        try{
            const tarefa = await new TarefasService().delete(req.params.id)
            return res.json(tarefa)
        } catch (error){
            console.error('Erro no controlador de exclusão:', error)  
        }
    }

    async findByUser(req: Request, res: Response) {
        try{
            const tarefas = await new TarefasService().findByUser(req.params.id)
            return res.json(tarefas)
        } catch (error){
            console.error('Erro no controlador de busca por usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async findTaskDescription(req: Request, res: Response) {
        try {
            const descricao = await new TarefasService().findTaskDescriptionById(req.params.id)
            return res.json({ descricao })
        } catch (error) {
            console.error('Erro no controlador de busca de descrição:', error)
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async findByCategory(req: Request, res: Response) {
        try {
            const tarefas = await new TarefasService().findByCategory(req.params.categoriaId)
            return res.json(tarefas)
        } catch (error) {
            console.error('Erro no controlador de busca por categoria:', error)
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async findByStatus(req: Request, res: Response) {
        const status = req.params.status
        if (status !== 'concluido' && status !== 'pendente') {
            return res.status(400).json({ message: 'Status inválido. Use "concluido" ou "pendente".' })
        }
    
        try {
            const tarefas = await new TarefasService().findByStatus(status)
            return res.json(tarefas)
        } catch (error) {
            console.error('Erro no controlador de busca por status:', error)
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async countTasksByUser(req: Request, res: Response) {
        const userId = req.params.userId
        try {
            const count = await new TarefasService().countTasksByUser(userId)
            return res.json({ count })
        } catch (error) {
            console.error('Erro no controlador de contagem de tarefas por usuário:', error)
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }

    async findLatestTaskByUser(req: Request, res: Response) {
        const userId = req.params.userId
        try {
            const latestTask = await new TarefasService().findLatestTaskByUser(userId)
            return res.json(latestTask)
        } catch (error) {
            console.error('Erro no controlador de busca da tarefa mais recente do usuário:', error)
            return res.status(500).json({ message: 'Erro interno do servidor' })
        }
    }
    
    async calculateCompletionAverage(req: Request, res: Response) {
        try {
            const average = await new TarefasService().calculateCompletionAverage();
            return res.json({ average });
        } catch (error) {
            console.error('Erro no cálculo da média de conclusão das tarefas:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async findTaskWithLongestDescription(req: Request, res: Response) {
        try {
            const task = await new TarefasService().findTaskWithLongestDescription();
            return res.json(task);
        } catch (error) {
            console.error('Erro no controlador de busca da tarefa com a descrição mais longa:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async groupTasksByCategory(req: Request, res: Response) {
        try {
            const groupedTasks = await new TarefasService().groupTasksByCategory();
            return res.json(groupedTasks);
        } catch (error) {
            console.error('Erro ao agrupar tarefas por categoria:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async findOldestTaskByUser(req: Request, res: Response) {
        try {
            const oldestTask = await new TarefasService().findOldestTaskByUser(req.params.userId);
            return res.json(oldestTask);
        } catch (error) {
            console.error('Erro ao encontrar a tarefa mais antiga do usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
    

}

export default new TarefaController()