import tarefaModel from "../schemas/tarefa.schema"
import usuarioModel from "../schemas/usuario.schema"
import categoriaModel from "../schemas/categoria.schema"

export class TarefasService {
    async create(tarefa: any) {
        try{
            const findedUsuario = await usuarioModel.findOne({ _id : tarefa.usuarioAssociado})
            const findedCategoria = await categoriaModel.findOne({ _id : tarefa.categoria })
            if(findedUsuario && findedCategoria){
                const createdTarefa = tarefaModel.create(tarefa)
                return createdTarefa
            }else{
                throw new Error('Usuário ou Categoria não encontrado')
            }
        } catch (error){
            console.error('Dados informados incorretos', error)
        }
    }

    async findById(_id: string) {
        try{
            const findedTarefa = await tarefaModel.findOne({ _id })
            return findedTarefa
        } catch (error){
            console.error('Erro ao buscar tarefa.', error)
        }
    }

    async findAll() {
        try{
            const findedTarefa = await tarefaModel.find()
            return findedTarefa
        } catch (error){
            console.error('Erro ao buscar tarefas.', error)
        }
    }

    async update(id: string, usuario: any) {
        try{
            const updatedTarefa = await tarefaModel.findOneAndUpdate({ id: id }, usuario, { new: true })
            return updatedTarefa
        } catch (error){
            console.error('Erro ao realizar update de tarefa.', error)
        }
    }

    async delete(id: string) {
        try{
            const deletedTarefa = await tarefaModel.deleteOne({ id: id })
            return deletedTarefa
        } catch (error){
            console.error('Erro ao deletar tarefa', error)
        }
    }

    async findByUser(userId: string) {
        try {
            const findedTarefas = await tarefaModel.find({ usuarioAssociado: userId })
            return findedTarefas
        } catch (error) {
            console.error('Erro ao buscar tarefas por usuário', error)
        }
    }

    async findTaskDescriptionById(id: string) {
        try {
            const tarefa = await tarefaModel.findById(id)
            return tarefa?.descricao
        } catch (error) {
            console.error('Erro ao buscar descrição de tarefa por ID:', error)
        }
    }

    async findByCategory(categoriaId: string) {
        try {
            const tarefas = await tarefaModel.find({ categoria: categoriaId })
            return tarefas
        } catch (error) {
            console.error('Erro ao buscar tarefas por categoria:', error)
            throw new Error('Erro ao buscar tarefas por categoria')
        }
    }

    async findByStatus(status: string) {
        try {
            const tarefas = await tarefaModel.find({ status: status })
            return tarefas
        } catch (error) {
            console.error('Erro ao buscar tarefas por status:', error)
            throw new Error('Erro ao buscar tarefas por status')
        }
    }

    async countTasksByUser(userId: string) {
        try {
            const count = await tarefaModel.countDocuments({ usuarioAssociado: userId })
            return count
        } catch (error) {
            console.error('Erro ao contar tarefas por usuário:', error)
            throw new Error('Erro ao contar tarefas por usuário')
        }
    }

    async findLatestTaskByUser(userId: string) {
        try {
            const latestTask = await tarefaModel.findOne({ usuarioAssociado: userId }).sort({ createdAt: -1 })
            return latestTask;
        } catch (error) {
            console.error('Erro ao encontrar a tarefa mais recente do usuário:', error)
            throw new Error('Erro ao encontrar a tarefa mais recente do usuário')
        }
    }


    async calculateCompletionAverage() {
        try {
            const allTasks = await tarefaModel.find();
            const completedTasks = allTasks.filter(task => task.status === 'concluido');
            
            if (allTasks.length === 0) {
                throw new Error('Nenhuma tarefa encontrada.');
            }

            const completionPercentage = (completedTasks.length / allTasks.length) * 100;
            return completionPercentage;
        } catch (error) {
            console.error('Erro ao calcular a média de conclusão das tarefas:', error);
            throw new Error('Erro ao calcular a média de conclusão das tarefas');
        }
    }

    async findTaskWithLongestDescription() {
        try {
            const tasks = await tarefaModel.find();
            let taskWithLongestDescription = tasks[0];
    
            for (let i = 1; i < tasks.length; i++) {
                if (tasks[i].descricao.length > taskWithLongestDescription.descricao.length) {
                    taskWithLongestDescription = tasks[i];
                }
            }
    
            return taskWithLongestDescription;
        } catch (error) {
            console.error('Erro ao buscar a tarefa com a descrição mais longa:', error);
            throw new Error('Erro ao buscar a tarefa com a descrição mais longa');
        }
    }

    async groupTasksByCategory() {
        try {
            const groupedTasks = await tarefaModel.aggregate([
                {
                    $group: {
                        _id: "$categoria",
                        tarefas: { $push: "$$ROOT" }
                    }
                }
            ]);
            return groupedTasks;
        } catch (error) {
            console.error('Erro ao agrupar tarefas por categoria:', error);
            throw new Error('Erro ao agrupar tarefas por categoria');
        }
    }


    async findOldestTaskByUser(userId: string) {
        try {
            const oldestTask = await tarefaModel.findOne({ usuarioAssociado: userId }).sort({ createdAt: 1 });
            return oldestTask;
        } catch (error) {
            console.error('Erro ao encontrar a tarefa mais antiga do usuário:', error);
            throw new Error('Erro ao encontrar a tarefa mais antiga do usuário');
        }
    }
    
    
    
}