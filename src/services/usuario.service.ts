import usuariosModel from '../schemas/usuario.schema'
import bcrypt from 'bcrypt';


export class UsuarioService {

    async signup(usuario: any) {
        try {
            const createdUsuario = await usuariosModel.create(usuario)
            return createdUsuario;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw new Error('Falha ao criar usuário. Por favor, verifique os dados fornecidos.');
        }
    }

    async login(email: string, senha: string) {
        try{
            const findedUsuario = await usuariosModel.findOne({ email })
            if (findedUsuario){
                const isPasswordValid = senha === findedUsuario.senha; 

                if(isPasswordValid) {
                    return findedUsuario;
                } else {
                    throw new Error('Senha inválida')
                }
            }else{
                throw new Error('Usuário não encontrado')
            }
        } catch (error){
            console.error('Falha ao buscar usuário', error)
        }
    }


    async create(usuario: any) {
        try{
            const createdUsuario = usuariosModel.create(usuario)
            return createdUsuario
        } catch (error){
            console.error('Falha ao criar usuário', error)
        }
    }

    async findById(id : String) {
        try{
            const findedUsuario = await usuariosModel.findOne({_id : id})
            return findedUsuario
        } catch (error){
            console.error('Falha ao buscar usuário', error)
        }
    }

    async findAll() {
        try{
            const findedUsuario = await usuariosModel.find()
            return findedUsuario
        } catch (error){
            console.error('Falha ao buscar usuários', error)
        }
    }

    async update(id: string, usuario: any) {
        try{
            const updatedUsuario = await usuariosModel.findOneAndUpdate({ _id: id }, usuario, { new: true })
            return updatedUsuario
        } catch (error){
            console.error('Falha ao alterar usuário', error)
        }
    }

    async delete(id: string) {
        try{
            const deletedUsuario = await usuariosModel.deleteOne({ _id: id })
            return deletedUsuario
        } catch (error){
            console.error('Falha ao deletar usuário', error)
        }
    }

}