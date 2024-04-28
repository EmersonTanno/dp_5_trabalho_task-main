import categoriaModel from "../schemas/categoria.schema"
import usuarioModel from "../schemas/usuario.schema"

export class CategoriaService {
    async create(categoria: any) {
        try{
            const findedUsuario = await usuarioModel.findOne({ _id : categoria.usuarioAssociado})

            if(findedUsuario){
                const cretedCategoria = categoriaModel.create(categoria)
                return cretedCategoria
            }else{
                throw new Error('Usuário não encontrado')
            }
        } catch (error){
            console.error('Dados informados incorretos', error)
        }
    }

    async findById(id: string) {
        try{
            const findedCategoria = await categoriaModel.findOne({ _id: id })
            return findedCategoria
        } catch (error){
            console.error('Erro ao buscar categoria')
        }
    }

    async findAll() {
        try{
            const findedCategoria = await categoriaModel.find()
            return findedCategoria
        } catch (error){
            console.error('Erro ao buscar categorias')
        }
    }

    async update(id: string, usuario: any) {
        try{
            const updatedCategoria = await categoriaModel.findOneAndUpdate({ id: id }, usuario, { new: true })
            return updatedCategoria
        } catch (error){
            console.error('Erro ao atualizar categoria')
        }
    }

    async delete(id: string) {
        try{
            const deletedCategoria = await categoriaModel.deleteOne({ id: id })
            return deletedCategoria
        } catch (error){
            console.error('Erro ao deletar categoria')
        }
    }

    async findByUser(userId: string) {
        try {
            const findedCategorias = await categoriaModel.find({ usuarioAssociado: userId });
            return findedCategorias;
        } catch (error) {
            console.error('Erro ao buscar categorias por usuário', error);
        }
    }

}