const request = require('supertest');
const app = require('../../app');

const MAIN_ROUTE = '/v1/transfers';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTk5OCwibmFtZSI6IlVzZXIgIzEiLCJtYWlsIjoidXNlcjFAbWFpbC5jb20ifQ.8OAUS9dPAf_ILy2rs1N6H3C0s3efCR-dWFsOakx16Z8';

beforeAll(async () => {
    await app.db.seed.run();
});

test('Deve listar apenas as transferências do usuário', () => {
    return request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Transfer #1');
    });
});
