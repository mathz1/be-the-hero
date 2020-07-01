const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

let id = "";

describe('ONG', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should be able to create a new ONG', async () => {
        const response = await request(app)
        .post('/ongs')
        .send({
            name: "APAD2",
            email: "contato@teste.com",
            whatsapp: "1114700000000",
            city: "Rio do Sul",
            uf: "SC"
        });

        id = response.body.id;

        expect(response.body).toHaveProperty('id');
        expect(response.body.id).toHaveLength(8);
    });

    it('should list the ONGs created', async () => {
        const response = await request(app).get('/ongs');

        const expected = {"city": "Rio do Sul", 
        "email": "contato@teste.com", 
        "id": id,
        "name": "APAD2", 
        "uf": "SC", 
        "whatsapp": "1114700000000"};

        expect(response.body).toEqual([expected]);
    });
});