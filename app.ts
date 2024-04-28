import express from 'express';
import mongoose from 'mongoose';
import userRouter from './src/routes/rotas.usuario';
import categoriaRouter from './src/routes/rotas.categoria';
import tarefaRouter from './src/routes/rotas.tarefas';

class App {
    private expressApp: express.Application;

    constructor() {
        this.expressApp = express();
        this.middleware();
        this.routes();
    }

    private middleware(): void {
        this.expressApp.use(express.json());
    }

    public static getInstance(): express.Application {
        const app = new App();
        return app.expressApp;
    }

    private routes(): void {
        this.expressApp.use(userRouter);
        this.expressApp.use(categoriaRouter);
        this.expressApp.use(tarefaRouter);
    }

    public static async startDatabase(): Promise<void> {
        try {
            mongoose.set("strictQuery", true);
            await mongoose.connect('mongodb://0.0.0.0:27017/trabalho');
            console.log("Connected to database successfully");
        } catch (error) {
            console.error("Cannot connect to database: ", error);
            throw error;
        }
    }

    public static async closeDatabase(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.log("Disconnected from database successfully");
        } catch (error) {
            console.error("Cannot disconnect from database: ", error);
            throw error;
        }
    }
}

export default App;
