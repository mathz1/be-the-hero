const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe('sessions', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should return a created ONG', async () => {
        const response_create = await request(app)
        .post('/ongs')
        .send({
            name: "APAD2",
            email: "contato@teste.com",
            whatsapp: "1114700000000",
            city: "Rio do Sul",
            uf: "SC"
        });

        const response = await request(app).post('/sessions').send({"id": response_create.body.id});

        expect(response.body.name).toBe("APAD2");
    });
});