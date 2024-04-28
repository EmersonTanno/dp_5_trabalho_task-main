import { Schema, model } from 'mongoose'

const usuarioSchema = new Schema({
    username: { 
        type: String, 
        required: true, 
    },
    peso: { 
        type: Number, 
        required: true 
    },
    senha: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        require: true  
    },
}, {
    timestamps: true
});

export default model('Usuarios', usuarioSchema)