import { Schema, model } from 'mongoose'
import Usuarios from './usuario.schema'
import UsuarioController from '../controller/usuario.controller'
import Categoria from './categoria.schema'

const tarefaSchema = new Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    dataCriacao: { type: Date, required: true },
    dataConclusao: { type: Date, required: true },
    tipo: { type: String, required: true },
    categoria: {
        type: Schema.Types.String,
        ref: Categoria,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'em andamento', 'concluido'],
        required: true
    },
    usuarioAssociado: {
        type: Schema.Types.String,
        ref: Usuarios,
        required: true,
    }
}, {
    timestamps: true
})

export default model('Tarefas', tarefaSchema)