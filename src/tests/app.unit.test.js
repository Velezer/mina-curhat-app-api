const db = require("../db")
jest.mock("../db")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")
const jwt = require("jwt-then")
jest.mock("jwt-then")

const request = require("supertest")
const createApp = require("../app")

const app = createApp(db, bcrypt, jwt)

const payloadAnonym = { name: 'anonym', role: 'anonym' }
const payloadConsultant = { _id: `_id`, name: 'consultant', role: 'consultant' }
const jwt_token = 'token'

describe('handler /', () => {
    it('GET / --> 200 server up', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
    })
})
describe('handler anonym --- /api/anonym', () => {
    const anonymData = { name: 'name', gender: 'male' }
    it('POST /login --> 200 server up', async () => {
        jwt.sign.mockResolvedValue('token')
        db.Anonym.prototype.save.mockResolvedValue({ _id: '_id', ...anonymData })
        await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `your anonym token can only be used within one week`,
                data: { token: 'token' }
            })
        expect(db.Anonym.prototype.save).toHaveBeenCalledTimes(1)
    })
})
describe('handler chatrooms --- /api/chatrooms', () => {

    const chatroomData = {
        name: 'chatroom_name',
        consultant: 'consultant_id',
        anonym: 'anonym',
        chatroom_token: 'chatroom_token'
    }
    it('POST / --> 401 no auth header', async () => {
        await request(app).post('/api/chatrooms')
            .expect('Content-Type', /json/)
            .expect(401, { message: `no auth header` })
    })
    it('POST / --> 401 invalid jwt', async () => {
        jwt.verify.mockRejectedValueOnce(new Error(`jwt invalid`))
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(401)
    })
    it('POST / --> 400 no input data but valid jwt', async () => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST / --> 400 role is not anonym', async () => {
        jwt.verify.mockResolvedValueOnce(payloadConsultant)
        db.Chatroom.prototype.save.mockResolvedValue()
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(400, { message: 'only anonym can create chatroom' })
    })
    it('POST / --> 201 chatroom created', async () => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
        db.Chatroom.prototype.save.mockResolvedValue()
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(201)
    })
    it('POST / --> 201 chatroom created', async () => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
        db.Chatroom.prototype.save.mockRejectedValue(new Error('save error'))
        await request(app).post('/api/chatrooms')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(chatroomData)
            .expect('Content-Type', /json/)
            .expect(500, { message: 'save error' })
    })
    it('GET / --> 200 getChatrooms anonym', async () => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
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
        jwt.verify.mockResolvedValueOnce(payloadConsultant)
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
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
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
        password: 'password',
        gender: 'male',
        role: 'consultant'
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
        db.Consultant.findOne.mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValue(consultantData) }))
        bcrypt.compare.mockResolvedValue(true)
        jwt.sign.mockResolvedValue('token')
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `User ${consultantData.name} logged in`,
                data: { token: 'token' }
            })
    })
    it('POST /login --> 400 consultant password wrong', async () => {
        db.Consultant.findOne.mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValue(consultantData) }))
        bcrypt.compare.mockResolvedValue(false)
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(400)
    })
    it('POST /login --> 404 consultant not found', async () => {
        db.Consultant.findOne.mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValue(null) }))
        await request(app).post('/api/consultants/login')
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(404)
    })
    it('DELETE / --> 200 consultant deleted', async () => {
        jwt.verify.mockResolvedValueOnce(payloadConsultant)
        db.Consultant.findOne.mockImplementationOnce(() => ({ select: jest.fn().mockResolvedValue({}) }))
        db.Consultant.deleteOne.mockResolvedValueOnce({})
        await request(app).delete('/api/consultants/')
            .set('Authorization', `Bearer ${jwt_token}`)
            .send(consultantData)
            .expect('Content-Type', /json/)
            .expect(200, {
                message: `consultant deleted`,
            })
    })
})