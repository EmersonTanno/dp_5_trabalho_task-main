import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';

let mongoServer: MongoMemoryServer;
let mongoURI: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoURI = mongoServer.getUri();
  await mongoose.connect(mongoURI);
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Testando rotas de usuário', () => {
  it('Deve criar um novo usuário', async () => {
    const response = await request(app)
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

  it('Deve realizar login de um usuário existente', async () => {
    await request(app)
      .post('/usuario/signup')
      .send({
        username: 'testuser',
        peso: 70,
        senha: 'password123',
        email: 'test@example.com'
      });

    const response = await request(app)
      .post('/usuario/login')
      .send({
        email: 'test@example.com',
        senha: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('usuário logado com sucesso');
    expect(response.body.usuario.username).toBe('testuser');
  });

});
