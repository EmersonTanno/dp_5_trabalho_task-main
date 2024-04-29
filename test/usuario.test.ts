import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import App from '../app';
import usuarioModel from '../src/schemas/usuario.schema';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await App.startDatabase(mongoUri);

});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await App.closeDatabase();
  await mongoServer.stop();
});

describe('Check user\'s CRUD operations', () => {

  it('Should create a new user with valid data', async () => {
    const response = await request(App.getInstance())
      .post('/usuario/signup')
      .send({
        username: 'testuser',
        peso: 70,
        senha: 'password123',
        email: 'test@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
    expect(response.body.email).toBe('test@example.com');
  });

  it('Should create a new user', async () => {
    const response = await request(App.getInstance())
      .post('/usuario/signup')
      .send({
        username: 'testuser',
        peso: 70,
        senha: 'password123',
        email: 'test@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('Should return 401 when login fails', async () => {
    await usuarioModel.create({
      username: 'testuser',
      peso: 70,
      senha: 'password123',
      email: 'test@example.com'
    });

    const response = await request(App.getInstance())
      .post('/usuario/login')
      .send({
        email: 'test@example.com',
        senha: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Usuário ou senha incorreto(s)');
  });

  it('Should update user by id', async () => {
    const user = await usuarioModel.create({
      username: 'testuser',
      peso: 70,
      senha: 'password123',
      email: 'test@example.com'
    });

    const response = await request(App.getInstance())
      .put(`/usuario/${user._id}`)
      .send({
        username: 'updateduser',
        peso: 75,
        senha: 'updatedpassword',
        email: 'updated@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('updateduser');
    expect(response.body.peso).toBe(75);
    expect(response.body.email).toBe('updated@example.com');
  });

  it('Should delete user by id', async () => {
    const user = await usuarioModel.create({
      username: 'testuser',
      peso: 70,
      senha: 'password123',
      email: 'test@example.com'
    });

    const response = await request(App.getInstance())
      .delete(`/usuario/${user._id}`);

    expect(response.status).toBe(200);
    expect(response.body.deletedCount).toBe(1);
  });
});
