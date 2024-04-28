import { Request, Response } from 'express'
import { UsuarioService } from '../services/usuario.service'


class UsuarioController {

    async signup(req: Request, res: Response) {
        try {
            const usuario = await new UsuarioService().signup(req.body);
            return res.json(usuario);
        } catch (error: any) {
            console.error('Erro no controlador de signup:', error.message);
            return res.status(400).send(error.message);
        }
    }

    async login(req: Request, res: Response) {
        const { email, senha } = req.body;
        try {
            const usuario = await new UsuarioService().login(email as string, senha as string);
            if (usuario) {
                return res.json({ message: "usuário logado com sucesso", usuario });
            } else {
                return res.status(401).json({ message: 'Usuário ou senha incorreto(s)' });
            }
        } catch (error) {
            console.error('Erro no controlador de login:', error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async create(req: Request, res: Response) {
        try{
            const usuario = await new UsuarioService().create(req.body)
            return res.json(usuario)
        } catch (error: any){
            console.error('Erro no controlador de criação:', error.message);
            return res.status(400).send(error.message);
        }
    }

    async findById(req: Request, res: Response) {
        try{
            const usuario = await new UsuarioService().findById(req.params.id)
            return res.json(usuario)
        } catch (error: any){
            console.error('Erro no controlador de busca:', error.message);
            return res.status(400).send(error.message);
        }
    }

    async findAll(req: Request, res: Response) {
        try{
            const usuario = await new UsuarioService().findAll()
            return res.json(usuario)
        } catch (error: any){
            console.error('Erro no controlador de busca:', error.message);
            return res.status(400).send(error.message);
        }
    }

    async update(req: Request, res: Response) {
        try{
            const usuario = await new UsuarioService().update(req.params.id, req.body)
            return res.json(usuario)
        } catch (error: any){
            console.error('Erro no controlador de alteração:', error.message);
            return res.status(400).send(error.message);
        }
    }

    async delete(req: Request, res: Response) {
        try{
            const usuario = await new UsuarioService().delete(req.params.id)
            return res.json(usuario)
        } catch (error: any){
            console.error('Erro no controlador de exclusão:', error.message);
            return res.status(400).send(error.message);
        }
    }
}

export default new UsuarioController()