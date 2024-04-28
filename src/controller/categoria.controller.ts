import { Request, Response } from 'express'
import { CategoriaService } from '../services/categoria.service'


class CategoriaController {
    async create(req: Request, res: Response) {
        try{
            const categoria = await new CategoriaService().create(req.body)

            if(categoria){
                return res.json(categoria)
            }else{
                return res.status(401).json({ message: 'Usuário incorreto(s)' })
            }
        } catch (error){
            console.error('Erro no controlador de criação:', error)
        }
    }

    async findById(req: Request, res: Response) {
        try{
            const categoria = await new CategoriaService().findById(req.params.id)
            return res.json(categoria)
        } catch (error){
            console.error('Erro no controlador de busca:', error)
        }
    }

    async findAll(req: Request, res: Response) {
        try{
            const categoria = await new CategoriaService().findAll()
            return res.json(categoria)
        } catch (error){
            console.error('Erro no controlador de busca:', error)
        }
    }

    async update(req: Request, res: Response) {
        try{
            const categoria = await new CategoriaService().update(req.params.id, req.body)
            return res.json(categoria)
        } catch (error){
            console.error('Erro no controlador de alteração:', error)
        }
    }

    async delete(req: Request, res: Response) {
        try{
            const categoria = await new CategoriaService().delete(req.params.id)
            return res.json(categoria)
        } catch (error){
            console.error('Erro no controlador de exclusão:', error)
        }
    }

    async findByUser(req: Request, res: Response) {
        try{
            const tarefas = await new CategoriaService().findByUser(req.params.id)
            return res.json(tarefas)
        } catch (error){
            console.error('Erro no controlador de busca por usuário:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
}

export default new CategoriaController()