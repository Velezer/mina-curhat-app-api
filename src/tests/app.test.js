const db = require("../db")
jest.mock("../db")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")
const jwt = require("jwt-then")
jest.mock("jwt-then")

const request = require("supertest")
const createApp = require("../app")

const app = createApp(db, bcrypt, jwt)


describe('handler /', () => {
    it('GET / --> 200 server up', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})
describe('handler anonym --- /api/anonym', () => {
    const anonymData = { name: 'name' }
    it('POST /login --> 200 server up', async () => {
        jwt.sign.mockResolvedValue('token')
        await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `your anonym token can only be used within one week`,
                token: 'token'
            })
    })
})
describe('handler chatrooms --- /api/chatrooms', () => {
    const jwt_token = 'token'
    const payloadAnonym = { name: 'anonym', role: 'anonym' }
    const payloadConsultant = { name: 'consultant', role: 'consultant' }
    const chatroomData = {
        name: 'chatroom_name',
        consultant: 'consultant',
        anonym: 'anonym',
        token_chatroom: 'token_chatroom'
    }
    it('POST / --> 401 no auth header', async () => {
        await request(app).post('/api/chatrooms')
            .expect('Content-Type', /json/)
            .expect(401, { message: `no auth header` })
    })
    it('POST / --> 401 invalid jwt', async () => {
        jwt.verify.mockRejectedValue(new Error(`jwt invalid`))
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(401)
    })
    it('POST / --> 400 no input data but valid jwt', async () => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST / --> 400 role is not anonym', async () => {
        jwt.verify.mockResolvedValue(payloadConsultant)
        db.Chatroom.prototype.save.mockResolvedValue()
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(400, { message: 'only anonym can create chatroom' })
    })
    it('POST / --> 201 chatroom created', async () => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        db.Chatroom.prototype.save.mockResolvedValue()
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    it('POST / --> 201 chatroom created', async () => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        db.Chatroom.prototype.save.mockRejectedValue(new Error('save error'))
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(500, { message: 'save error' })
    })
    it('GET / --> 200 getChatrooms anonym', async () => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        db.Chatroom.find.mockResolvedValue([])
        await request(app).get('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `getChatrooms`,
                data: [] // based on mock value, i use [] for simplicity
            })
    })
    it('GET / --> 200 getChatrooms consultant', async () => {
        jwt.verify.mockResolvedValue(payloadConsultant)
        db.Chatroom.find.mockResolvedValue([])
        await request(app).get('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `getChatrooms`,
                data: [] // based on mock value, i use [] for simplicity
            })
    })
    it('GET / --> 200 getChatroomsById', async () => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        db.Chatroom.findOne.mockResolvedValue([])
        await request(app).get('/api/chatrooms/92831923')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `getChatroomsById`,
                data: []
            })
    })
})
describe('handler consultants --- /api/consultants', () => {
    const consultantData = {
        name: 'name',
        password: 'password'
    }
    it('GET / --> 200 get all consultants', async () => {
        db.Consultant.find.mockResolvedValue([])
        await request(app).get('/api/consultants')
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `get all consultants`,
                data: []
            })
    })
    it('POST /register --> 201 create consultant', async () => {
        db.Consultant.findOne.mockResolvedValue(null)
        db.Consultant.prototype.save.mockResolvedValue(consultantData)
        await request(app).post('/api/consultants/register')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    it('POST /register --> 409 consultant already exist', async () => {
        db.Consultant.findOne.mockResolvedValue(consultantData)
        await request(app).post('/api/consultants/register')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(409)
    })
    it('POST /login --> 200 consultant login', async () => {
        db.Consultant.findOne.mockResolvedValue(consultantData)
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockResolvedValue('token')
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `User ${consultantData.name} logged in`,
                token: 'token'
            })
    })
    it('POST /login --> 400 consultant password wrong', async () => {
        db.Consultant.findOne.mockResolvedValue(consultantData)
        bcrypt.compare.mockResolvedValue(false)
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST /login --> 404 consultant not found', async () => {
        db.Consultant.findOne.mockResolvedValue(null)
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
})