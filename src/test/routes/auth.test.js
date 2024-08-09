const request = require('supertest');
const app = require('../../app');
//const { test } = require('../../../knexfile');

test('Deve receber token ao logar', () => {
  const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'Walter Mitty', mail, passwd: '123456' })
    .then(() => request(app).post('/auth/signin')
      .send({ mail, passwd: '123456' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });  
});

test('Não deve autenticar usuário com senha errada', () => {
    const mail = `${Date.now()}@mail.com`;
  return app.services.user.save({ name: 'Walter Mitty', mail, passwd: '123456' })
    .then(() => request(app).post('/auth/signin')
      .send({ mail, passwd: '654321' }))
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error', 'Usuário ou senha invalido');
    });
});

test('Não deve autenticar usuário com email errado', () => {
    return request(app).post('/auth/signin')
      .send({ mail: 'naoexiste@mail.com' , passwd: '654321' })
        .then((res) => {
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('error', 'Usuário ou senha invalido');
        });
});

