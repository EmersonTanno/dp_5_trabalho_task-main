import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import App from '../app';
import usuarioModel from '../src/schemas/usuario.schema';
import categoriaModel from '../src/schemas/categoria.schema';

let mongoServer: MongoMemoryServer;
let userId: string;
let userId2: string;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    const user = await usuarioModel.create({
        username: 'testuser',
        peso: 70,
        senha: 'password123',
        email: 'test@example.com'
    });
    userId = user._id.toHexString();

    const user2 = await usuarioModel.create({
        username: 'testuser2',
        peso: 80,
        senha: 'password1233',
        email: 'test@example2.com'
    });
    userId2 = user2._id.toHexString();
});

afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Check category route http responses', () => {
    it('Should create a new category', async () => {
        const response = await request(App.getInstance())
            .post('/categoria')
            .send({
                nome: 'Test Category',
                cor: '#FFFFFF',
                usuarioAssociado: userId
            });

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe('Test Category');
    });

    it('Should return all categories', async () => {
        await categoriaModel.create({ nome: 'Category 1', cor: '#FFFFFF', usuarioAssociado: userId });
        await categoriaModel.create({ nome: 'Category 2', cor: '#FFFFFF', usuarioAssociado: userId });

        const response = await request(App.getInstance())
            .get('/categoria/');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it('Should return category by id', async () => {
        const category = await categoriaModel.create({ nome: 'Test Category', cor: '#FFFFFF', usuarioAssociado: userId });

        const response = await request(App.getInstance())
            .get(`/categoria/${category._id}`);

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe('Test Category');
    });

    it('Should update category by id', async () => {
        const category = await categoriaModel.create({ nome: 'Test Category', cor: '#FFFFFF', usuarioAssociado: userId });

        const response = await request(App.getInstance())
            .put(`/categoria/${category._id}`)
            .send({
                nome: 'Updated',
                cor: '#000000',
                usuarioAssociado: userId
            });

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe('Updated');
        expect(response.body.cor).toBe('#000000');
        expect(response.body.usuarioAssociado).toBe(userId);
    });

    it('Should delete category by id', async () => {
        const category = await categoriaModel.create({ nome: 'Test Category', cor: '#FFFFFF', usuarioAssociado: userId });

        const response = await request(App.getInstance())
            .delete(`/categoria/${category._id}`);

        expect(response.status).toBe(200);
        expect(response.body.deletedCount).toBe(1);
    });

    it('Should return categories by user id', async () => {
        const user_id = userId;
        await categoriaModel.create({ nome: 'Category 1', cor: '#FFFFFF', usuarioAssociado: userId });
        await categoriaModel.create({ nome: 'Category 2', cor: '#FFFFFF', usuarioAssociado: userId });
        await categoriaModel.create({ nome: 'Category 3', cor: '#FFFFFF', usuarioAssociado: userId2 });

        const response = await request(App.getInstance())
            .get(`/categoria/user/${user_id}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });
});
