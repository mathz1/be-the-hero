const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

let ong_id = "";

describe('incidents', () => {
    beforeAll(async () => {
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    it('should create a new incident', async () => {
        const response_ong_create = await request(app)
        .post('/ongs')
        .send({
            name: "APAD2",
            email: "contato@teste.com",
            whatsapp: "1114700000000",
            city: "Rio do Sul",
            uf: "SC"
        });

        const response_incident = await request(app).post('/incidents').send({
            title: "Titulo",
            description: "Detalhes do caso",
            value: 120
        }).set('Authorization', response_ong_create.body.id);

        ong_id = response_ong_create.body.id;

        expect(response_incident.body.id).toBe(1);
    });

    it('should list all incidents of all ONGs', async () => {
        const response_new_ong_create = await request(app)
        .post('/ongs')
        .send({
            name: "APAD",
            email: "contato@teste1.com",
            whatsapp: "1214700000000",
            city: "Rio do Norte",
            uf: "SC"
        });

        const response_new_incident = await request(app).post('/incidents').send({
            title: "Titulo2",
            description: "Detalhes do caso2",
            value: 140
        }).set('Authorization', response_new_ong_create.body.id);

        const expected = [{
            "id": 1,
            "title": "Titulo",
            "description": "Detalhes do caso",
            "value": 120,
            "ong_id": ong_id,
            "name": "APAD2",
            "email": "contato@teste.com",
            "whatsapp": "1114700000000",
            "city": "Rio do Sul",
            "uf": "SC"
        },
        {
            "id": 2,
            "title": "Titulo2",
            "description": "Detalhes do caso2",
            "value": 140,
            "ong_id": response_new_ong_create.body.id,
            "name": "APAD",
            "email": "contato@teste1.com",
            "whatsapp": "1214700000000",
            "city": "Rio do Norte",
            "uf": "SC"
        }];

        const response_list_incidents = await request(app).get('/incidents');

        expect(response_list_incidents.body).toEqual(expected);
        expect(response_new_incident.body.id).toBe(2);
    });

    it('should delete determined incident', async () => {
        const response = await request(app).delete('/incidents/1').set('Authorization', ong_id);

        expect(response.status).toBe(204);
    });
});