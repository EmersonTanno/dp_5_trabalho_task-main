import { Schema, model } from 'mongoose'
import Usuarios from './usuario.schema'

const categoriaSchema = new Schema({
    nome: { type: String, required: true },
    cor: { type: String, required: true },
    usuarioAssociado: {
        type: Schema.Types.String,
        ref: Usuarios,
        required: true,
    }
}, {
    timestamps: true
})

export default model('Categorias', categoriaSchema)