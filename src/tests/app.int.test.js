require("dotenv").config()
const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jwt-then")

const request = require("supertest")
const createApp = require("../app")

const app = createApp(db, bcrypt, jwt)

jest.setTimeout(31000)

beforeAll((done) => {
    db.dbConnect(process.env.DB_URI_TEST)
        .once('open', () => done())
        .on('error', (err) => done(err))
})
afterAll((done) => {
    db.dbClose()
        .then(() => done())
        .catch((err) => done(err))
})

let jwt_token_anonym, jwt_token_consultant

describe('handler anonym --- /api/anonym', () => {
    const anonymData = { name: 'naame', gender: 'male' }

    beforeEach(async () => {
        await db.Anonym.deleteMany({})
    })
    afterEach(async () => {
        await db.Anonym.deleteMany({})
    })

    it('POST /login --> 200 anonym login to get jwt token', async () => {
        const result = await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(200)
        jwt_token_anonym = JSON.parse(result.res.text).data.token

        await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(409, { message: 'anonym name has already taken' })
    })
})


describe('handler consultants --- /api/consultants', () => {
    const consultantData = {
        name: 'name',
        password: 'password',
        gender: 'male',
        role: 'consultant'
    }
    beforeAll(async () => {
        await db.Consultant.deleteMany({})
    })
    afterAll(async () => {
        await db.Consultant.deleteMany({})
    })

    it('GET / --> 200 get all consultants', async () => {
        await request(app).get('/api/consultants')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `get all consultants`,
                data: []
            })
    })
    it('POST /register --> 201 create consultant', async () => {
        await request(app).post('/api/consultants/register')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    it('POST /register --> 409 consultant already exist', async () => {
        await request(app).post('/api/consultants/register')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(409)
    })
    it('POST /login --> 200 consultant login', async () => {
        const result = await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(200)
        jwt_token_consultant = JSON.parse(result.res.text).data.token
    })
    it('POST /login --> 400 consultant password wrong', async () => {
        consultantData.password = 'wrongPassword'
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST /login --> 404 consultant not found', async () => {
        consultantData.name = 'notFound'
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
    it('GET / --> 200 get all consultants', async () => {
        await request(app).get('/api/consultants')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})


describe('handler chatrooms --- /api/chatrooms', () => {
    const payloadAnonym = { name: 'anonym', role: 'anonym' }
    const payloadConsultant = { name: 'consultant', role: 'consultant' }
    const chatroomData = {
        name: 'chatroom_name',
        consultant: new db.Consultant(),
        anonym: 'anonym',
        chatroom_token: 'chatroom_token'
    }

    afterAll(async () => {
        await db.Chatroom.deleteMany({})
    })

    it('POST / --> 401 no auth header', async () => {
        await request(app).post('/api/chatrooms')
            .expect('Content-Type', /json/)
            .expect(401, { message: `no auth header` })
    })
    it('POST / --> 401 invalid jwt', async () => {
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer mdkasmdklasmdp`)
            .expect('Content-Type', /json/)
            .expect(401)
    })
    it('POST / --> 400 no input data but valid jwt', async () => {
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token_anonym}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST / --> 400 role is not anonym', async () => {
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token_consultant}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(400, { message: 'only anonym can create chatroom' })
    })
    it('POST / --> 201 chatroom created', async () => {
        const result = await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token_anonym}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(201)

        const chatroom = JSON.parse(result.res.text).data

        await request(app).get('/api/chatrooms/' + chatroom._id)
            .set('Authorization', `Bearer ${jwt_token_anonym}`)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `getChatroomsById`,
                data: chatroom
            })
    })
    it('GET / --> 200 getChatrooms anonym', async () => {
        await request(app).get('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token_anonym}`)
            .expect('Content-Type', /json/)
            .expect(200)
    })
    it('GET / --> 200 getChatrooms consultant', async () => {
        await request(app).get('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token_consultant}`)
            .expect('Content-Type', /json/)
            .expect(200)
    })

})