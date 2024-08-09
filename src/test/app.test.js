const request = require('supertest');

const app = require('../app');

test('Deve responder na porta raiz', () => {
    return request(app).get('/').then(res => expect(res.status).toBe(200));
});