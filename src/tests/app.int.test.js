process.env.ENVIRONTMENT = 'test'
const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jwt-then")

const request = require("supertest")
const createApp = require("../app")

const app = createApp(db, bcrypt, jwt)

jest.setTimeout(11000)

beforeAll((done) => {
    db.dbConnect()
        .once('open', () => done())
        .on('error', (error) => done(error))
})
afterAll((done) => {
    db.dbClose()
        .then(() => done())
        .catch((err) => done(err))
})
describe('handler anonym --- /api/anonym', () => {
    const anonymData = { name: 'naame', gender: 'male' }

    afterEach(async () => {
        await db.Anonym.deleteMany({})
    })

    it('POST /login --> 200 anonym login to get jwt token', async () => {
        await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(200)
        await request(app).post('/api/anonym/login')
            .send(anonymData)
            .expect('Content-Type', /json/)
            .expect(409, { message: 'anonym name has already taken' })
    })
})
// describe('handler chatrooms --- /api/chatrooms', () => {
//     const jwt_token = 'token'
//     const payloadAnonym = { name: 'anonym', role: 'anonym' }
//     const payloadConsultant = { name: 'consultant', role: 'consultant' }
//     const chatroomData = {
//         name: 'chatroom_name',
//         consultant: 'consultant',
//         anonym: 'anonym',
//         token_chatroom: 'token_chatroom'
//     }
//     it('POST / --> 401 no auth header', async () => {
//         await request(app).post('/api/chatrooms')
//             .expect('Content-Type', /json/)
//             .expect(401, { message: `no auth header` })
//     })
//     it('POST / --> 401 invalid jwt', async () => {
//         await request(app).post('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .expect('Content-Type', /json/)
//             .expect(401)
//     })
//     it('POST / --> 400 no input data but valid jwt', async () => {
//         await request(app).post('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .expect('Content-Type', /json/)
//             .expect(400)
//     })
//     it('POST / --> 400 role is not anonym', async () => {
//         await request(app).post('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .send(chatroomData)
//             .expect('Content-Type', /json/)
//             .expect(400, { message: 'only anonym can create chatroom' })
//     })
//     it('POST / --> 201 chatroom created', async () => {
//         await request(app).post('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .send(chatroomData)
//             .expect('Content-Type', /json/)
//             .expect(201)
//     })
//     it('POST / --> 201 chatroom created', async () => {
//         await request(app).post('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .send(chatroomData)
//             .expect('Content-Type', /json/)
//             .expect(500, { message: 'save error' })
//     })
//     it('GET / --> 200 getChatrooms anonym', async () => {
//         await request(app).get('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .expect('Content-Type', /json/)
//             .expect(200, {
//                 message: `getChatrooms`,
//                 data: [] // based on mock value, i use [] for simplicity
//             })
//     })
//     it('GET / --> 200 getChatrooms consultant', async () => {
//         await request(app).get('/api/chatrooms')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .expect('Content-Type', /json/)
//             .expect(200, {
//                 message: `getChatrooms`,
//                 data: [] // based on mock value, i use [] for simplicity
//             })
//     })
//     it('GET / --> 200 getChatroomsById', async () => {
//         await request(app).get('/api/chatrooms/92831923')
//             .set('Authorization', `Bearer ${jwt_token}`)
//             .expect('Content-Type', /json/)
//             .expect(200, {
//                 message: `getChatroomsById`,
//                 data: []
//             })
//     })
// })

// describe('handler consultants --- /api/consultants', () => {
//     const consultantData = {
//         name: 'name',
//         password: 'password',
//         gender: 'male',
//         role: 'consultant'
//     }
//     it('GET / --> 200 get all consultants', async () => {
//         await request(app).get('/api/consultants')
//             .expect('Content-Type', /json/)
//             .expect(200, {
//                 message: `get all consultants`,
//                 data: []
//             })
//     })
//     it('POST /register --> 201 create consultant', async () => {
//         await request(app).post('/api/consultants/register')
//             .send(consultantData)
//             .expect('Content-Type', /json/)
//             .expect(201)
//     })
//     it('POST /register --> 409 consultant already exist', async () => {
//         await request(app).post('/api/consultants/register')
//             .send(consultantData)
//             .expect('Content-Type', /json/)
//             .expect(409)
//     })
//     it('POST /login --> 200 consultant login', async () => {
//         await request(app).post('/api/consultants/login')
//             .send(consultantData)
//             .expect('Content-Type', /json/)
//             .expect(200, {
//                 message: `User ${consultantData.name} logged in`,
//                 token: 'token'
//             })
//     })
//     it('POST /login --> 400 consultant password wrong', async () => {
//         await request(app).post('/api/consultants/login')
//             .send(consultantData)
//             .expect('Content-Type', /json/)
//             .expect(400)
//     })
//     it('POST /login --> 404 consultant not found', async () => {
//         await request(app).post('/api/consultants/login')
//             .send(consultantData)
//             .expect('Content-Type', /json/)
//             .expect(404)
//     })
// })