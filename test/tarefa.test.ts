
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import App from '../app';
import usuarioModel from '../src/schemas/usuario.schema';
import categoriaModel from '../src/schemas/categoria.schema';
import tarefaModel from '../src/schemas/tarefa.schema';

let mongoServer: MongoMemoryServer;
let userId: string;
let userId2: string;
let categoryId: string;
let categoryId2: string;


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await App.startDatabase();

    const user = await usuarioModel.create({
        username: 'testuser1',
        peso: 70,
        senha: 'password123',
        email: 'test@example.com'
    });
    userId = (user._id).toHexString();

    const user2 = await usuarioModel.create({
        username: 'testuser2',
        peso: 80,
        senha: 'password1233',
        email: 'test@example2.com'
    });
    userId2 = (user2._id).toHexString();

    const category = await categoriaModel.create({
        nome: 'Category 1', 
        cor: '#FFFFFF', 
        usuarioAssociado: userId 
    })
    categoryId = (category._id).toHexString();

    const category2 = await categoriaModel.create({
        nome: 'Category 2', 
        cor: '#FFFFFF', 
        usuarioAssociado: userId2 
    })
    categoryId2 = (category2._id).toHexString();

});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await App.closeDatabase();
  await mongoServer.stop();
});

describe('Check task\'s CRUD operations', () => {
    it('Should create a new task', async () => {

    const response = await request(App.getInstance())
        .post('/tarefa')
        .send({
        titulo: 'Test Task',
        descricao: 'Test description',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Test type',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
        });

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe('Test Task');
    });

    it('Should return all tasks by user', async () => {

    await tarefaModel.create({
        titulo: 'Task 1',
        descricao: 'Description 1',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 1',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 2',
        descricao: 'Description 2',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 2',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 3',
        descricao: 'Description 3',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 3',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId2,
        });

    const response = await request(App.getInstance())
        .get(`/tarefa/user/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    });

    it('Should find a task by ID', async () => {
    const task = await tarefaModel.create({
        titulo: 'Test Task',
        descricao: 'Test description',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Test type',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    const taskId = task._id;

    const response = await request(App.getInstance()).get(`/tarefa/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.titulo).toBe('Test Task');
    });

    it('Should return all tasks', async () => {
    await tarefaModel.create({
        titulo: 'Task 1',
        descricao: 'Description 1',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 1',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 2',
        descricao: 'Description 2',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 2',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    const response = await request(App.getInstance()).get('/tarefa/');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    });


    it('Should calculate the completion average of tasks', async () => {
    await tarefaModel.create({
        titulo: 'Task 1',
        descricao: 'Description 1',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 1',
        categoria: categoryId,
        status: 'concluido',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 2',
        descricao: 'Description 2',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 2',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    const response = await request(App.getInstance()).get('/tarefa/media_conclusao');

    expect(response.status).toBe(200);
    expect(response.body.average).toBe(50);
    });

    it('Should find the task with the longest description', async () => {
    await tarefaModel.create({
        titulo: 'Task 1',
        descricao: 'Short description',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 1',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 2',
        descricao: 'Very long description that should be the longest',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 2',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    const response = await request(App.getInstance()).get('/tarefa/longest_description');

    expect(response.status).toBe(200);
    expect(response.body.descricao).toBe('Very long description that should be the longest');
    });

    it('Should group tasks by category', async () => {
    await tarefaModel.create({
        titulo: 'Task 1',
        descricao: 'Description 1',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 1',
        categoria: categoryId,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    await tarefaModel.create({
        titulo: 'Task 2',
        descricao: 'Description 2',
        dataCriacao: new Date(),
        dataConclusao: new Date(),
        tipo: 'Type 2',
        categoria: categoryId2,
        status: 'pendente',
        usuarioAssociado: userId,
    });

    const response = await request(App.getInstance()).get('/tarefa/agrupadas_por_categoria');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); 
    });

    it('Should find task description by ID', async () => {
        const task = await tarefaModel.create({
          titulo: 'Task with Description',
          descricao: 'This is a test description',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance()).get(`/tarefa/description/${task._id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.descricao).toBe('This is a test description');
      });
    
      it('Should find tasks by category', async () => {
        const task1 = await tarefaModel.create({
          titulo: 'Task 1',
          descricao: 'Description 1',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        await tarefaModel.create({
          titulo: 'Task 2',
          descricao: 'Description 2',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 2',
          categoria: categoryId2, 
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance()).get(`/tarefa/categoria/${categoryId}`);
    
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1); 
        expect(response.body[0]._id).toBe(task1._id.toHexString());
      });
    
      it('Should find tasks by status', async () => {
        await tarefaModel.create({
          titulo: 'Completed Task',
          descricao: 'Description of completed task',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'concluido', 
          usuarioAssociado: userId,
        });
    
        await tarefaModel.create({
          titulo: 'Pending Task',
          descricao: 'Description of pending task',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 2',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance()).get(`/tarefa/status/concluido`);
    
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].titulo).toBe('Completed Task');
      });

      it('Should count tasks by user', async () => {
        await tarefaModel.create({
          titulo: 'Task 1',
          descricao: 'Description 1',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        await tarefaModel.create({
          titulo: 'Task 2',
          descricao: 'Description 2',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 2',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance()).get(`/tarefa/count/${userId}`);
    
        expect(response.status).toBe(200);
        expect(response.body.count).toBe(2); 
      });
    
      it('Should find the latest task by user', async () => {
        const latestTask = await tarefaModel.create({
          titulo: 'Latest Task',
          descricao: 'Description of latest task',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        await tarefaModel.create({
          titulo: 'Older Task',
          descricao: 'Description of older task',
          dataCriacao: new Date('2022-01-01'), 
          dataConclusao: new Date('2022-01-02'),
          tipo: 'Type 2',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance()).get(`/tarefa/latest/${userId}`);
    
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(latestTask._id.toHexString()); 
      });
    
      it('Should find the oldest task by user', async () => {

        const oldestTask = await tarefaModel.create({
            titulo: 'Oldest Task',
            descricao: 'Description of oldest task',
            dataCriacao: new Date('2021-01-31'), 
            dataConclusao: new Date('2022-01-01'),
            tipo: 'Type 2',
            categoria: categoryId,
            status: 'pendente',
            usuarioAssociado: userId,
          });

        const newTask = await tarefaModel.create({
          titulo: 'Older Task',
          descricao: 'Description of older task',
          dataCriacao: new Date('2022-01-01'), 
          dataConclusao: new Date('2022-01-02'),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
      
        const response = await request(App.getInstance()).get(`/tarefa/mais_antiga/${userId}`);
      
        expect(response.status).toBe(200);
        expect(response.body._id).toBe(oldestTask._id.toString()); 
      });
      
      it('Should update a task', async () => {
        const task = await tarefaModel.create({
          titulo: 'Task to Update',
          descricao: 'Description of task to update',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
      
        const updatedData = {
          titulo: 'Updated Task Title',
          descricao: 'Updated description of task',
          dataConclusao: new Date('2022-12-31'), 
          tipo: 'Updated Type',
          categoria: categoryId2, 
          status: 'concluido',
          usuarioAssociado: userId2, 
        };
      
        const response = await request(App.getInstance())
          .put(`/tarefa/${task._id}`)
          .send(updatedData);
      
        expect(response.status).toBe(200);
        expect(response.body.titulo).toBe('Updated Task Title');
        expect(response.body.descricao).toBe('Updated description of task');
        expect(response.body.dataConclusao).toBe(updatedData.dataConclusao.toISOString());
        expect(response.body.tipo).toBe('Updated Type');
        expect(response.body.categoria).toBe(categoryId2);
        expect(response.body.status).toBe('concluido');
        expect(response.body.usuarioAssociado).toBe(userId2);
      });

      it('Should delete a task', async () => {
        const task = await tarefaModel.create({
          titulo: 'Task to Delete',
          descricao: 'Description of task to delete',
          dataCriacao: new Date(),
          dataConclusao: new Date(),
          tipo: 'Type 1',
          categoria: categoryId,
          status: 'pendente',
          usuarioAssociado: userId,
        });
    
        const response = await request(App.getInstance())
          .delete(`/tarefa/${task._id}`);
    
        expect(response.status).toBe(200);
        expect(response.body.deletedCount).toBe(1);
      });
  
});
