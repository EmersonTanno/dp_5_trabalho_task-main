import express from 'express'
import mongoose from 'mongoose'
import userRouter from './src/routes/rotas.usuario'
import categoriaRouter from './src/routes/rotas.categoria'
import tarefaRouter from './src/routes/rotas.tarefas'

class App {
    express: express.Application

    constructor() {
        this.express = express()
        this.middleware()
        this.database()
        this.routes()
    }

    private middleware(): void {
        this.express.use(express.json())
    }

    private async database() {
        try {
            mongoose.set("strictQuery", true)
            await mongoose.connect('mongodb://0.0.0.0:27017/trabalho')
            console.log("connect database sucess")
        } catch (error) {
            console.error("cannot connect to database: ", error)
        }
    }

    private routes(): void {
        this.express.use(userRouter);
        this.express.use(categoriaRouter);
        this.express.use(tarefaRouter);
    }
}

export default new App().express