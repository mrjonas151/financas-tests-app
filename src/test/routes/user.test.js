const request = require('supertest');

const app = require('../../app');
//const { test } = require('../../../knexfile');

const mail = `${Date.now()}@mail.com`;


test('Deve Listar todos os usuários', async () => {
    const res = await request(app).get('/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
});

test.only('Deve inserir um usuário com sucesso', () => {
    return request(app).post('/users')
        .send({ name: 'Walter Mitty', mail, passwd: '123456' })
        .then((res) => {
            expect(res.status).toBe(201);
            expect(res.body.name).toBe('Walter Mitty');
            expect(res.body).not.toHaveProperty('passwd');
        });
});

test('Deve armazenar senha criptografada', async () => {
    const res = await request(app).post('/users')
        .send({ name: 'Walter Mitty', mail: `${Date.now()}@mail.com`, passwd: '123456' });
    expect(res.status).toBe(201);

    const { id } = res.body;
    const userDb = await app.services.user.findOne({ id });
    expect(userDb.passwd).not.toBeUndefined();
    expect(userDb.passwd).not.toBe('123456');
});

test('Não deve inserir usuário sem nome', () => {
    return request(app).post('/users')
        .send({ mail: 'walt@gmail.com', passwd: '123456' })
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Nome é um atributo obrigatório');
        });
});

test('Não deve inserir usuário sem email', async () => {
    const result = await request(app).post('/users')
        .send({ name: 'Walter Mitty', passwd: '123456' });
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Email é um atributo obrigatório');
});

test('Não deve inserir usuário sem senha', (done) => {
    request(app).post('/users')
        .send({ name: 'Walter Mitty', mail: 'walter@mail.com '})
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Senha é um atributo obrigatório');
            done();
        }).catch(err => done.fail(err));
});

test('Não deve inserir usuário com email existente', () => {
    return request(app).post('/users')
        .send({ name: 'Walter Mitty', mail, passwd: '123456' })
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Já existe um usuário com esse email');
        });
});