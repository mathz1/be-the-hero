const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');
const { response } = require('express');

describe('profile', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should list all cases of determined ONG', async () => {
        const response_ong_create = await request(app)
        .post('/ongs')
        .send({
            name: "APAD2",
            email: "contato@teste.com",
            whatsapp: "1114700000000",
            city: "Rio do Sul",
            uf: "SC"
        });

        await request(app).post('/incidents').send({
            title: "Titulo",
            description: "Detalhes do caso",
            value: 120
        }).set('Authorization', response_ong_create.body.id);

        const expected = [{
            id: 1,
            title: "Titulo",
            description: "Detalhes do caso",
            value: 120,
            ong_id: response_ong_create.body.id
        }];

        const response_new_ong_create = await request(app)
        .post('/ongs')
        .send({
            name: "APAD2",
            email: "contato@teste.com",
            whatsapp: "1114700000000",
            city: "Rio do Sul",
            uf: "SC"
        });

        const response_list = await request(app).get('/profile').set('Authorization', response_ong_create.body.id);
        const response_new_list = await request(app).get('/profile').set('Authorization', response_new_ong_create.body.id);

        expect(response_list.body).toEqual(expected);
        expect(response_new_list.body).toEqual([]);
    });
});