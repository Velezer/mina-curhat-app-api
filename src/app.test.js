const db = require("./db")
jest.mock("./db")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")
const jwt = require("jwt-then")
jest.mock("jwt-then")

const request = require("supertest")
const createApp = require("./app")

const app = createApp(db, bcrypt, jwt)


describe('handler /', () => {
    it('GET / --> 200 server up', async () => {
        await request(app).get('/')
            .expect('Content-Type', /json/)
            .expect(200)
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