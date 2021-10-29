const db = require("../db")
const bcrypt = require("bcrypt")
const jwt = require("jwt-then")
require("dotenv").config()

const Client = require("socket.io-client")
const createServer = require("../ioServer")

const server = createServer(db, bcrypt, jwt)
let port = 5556
server.listen(port)

jest.setTimeout(30000)

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

let payloadConsultant, payloadAnonym
describe('message socket', () => {
    let clientAnonym, clientConsultant
    let chatroomId

    beforeAll(async () => {
        await db.Anonym.deleteMany({})
        await db.Consultant.deleteMany({})
        await db.Chatroom.deleteMany({})

        const anonym = new db.Anonym({
            name: 'secretAnonym',
            gender: 'female',
            role: 'anonym',
            password: 'password',
            model: 'Anonym'
        })
        const anonymData = await anonym.save()
        payloadAnonym = { _id: anonymData._id, name: anonymData.name, gender: anonymData.gender, role: 'anonym', model: 'Anonym' }
        const tokenAnonym = await jwt.sign(payloadAnonym, process.env.JWT_KEY)
        clientAnonym = new Client(`http://localhost:${port}`, {
            auth: {
                token: tokenAnonym
            }
        })

        const consultant = new db.Consultant({
            name: 'secretConsultant',
            gender: 'female',
            role: 'consultant',
            password: 'password',
            model: 'Consultant'
        })
        const consultantData = await consultant.save()
        payloadConsultant = { _id: consultantData._id, name: consultantData.name, gender: consultantData.gender, role: 'consultant', model: 'Consultant' }
        const tokenConsultant = await jwt.sign(payloadConsultant, process.env.JWT_KEY)
        clientConsultant = new Client(`http://localhost:${port}`, {
            auth: {
                token: tokenConsultant
            }
        })

        const chatroom = new db.Chatroom({ consultant: consultantData._id, anonym: anonymData._id, chatroom_token: 'chatroomToken' })
        const chatroomData = await chatroom.save()
        chatroomId = chatroomData._id

    })

    afterAll(() => {
        clientAnonym.close()
        clientConsultant.close()
    })

    beforeAll(done => {
        clientAnonym.on('joinedRoom', arg => {
            expect(arg.toString()).toBe(chatroomId.toString())
            done()
        })
        clientAnonym.emit('joinRoom', { chatroomId })
    })

    beforeAll(done => {
        clientConsultant.on('joinedRoom', arg => {
            expect(arg.toString()).toBe(chatroomId.toString())
            done()
        })
        clientConsultant.emit('joinRoom', { chatroomId })
    })

    it('consultant send message', (done) => {
        clientAnonym.on('newMessage', (arg) => {
            expect(arg.sender.toString()).toBe(payloadConsultant._id.toString())
            expect(arg.message).toBe('iamconsultant')
            done()
        })
        clientConsultant.emit('sendMessage', { chatroomId, message: 'iamconsultant' })
    })

    it('anonym send message', (done) => {
        clientConsultant.on('newMessage', (arg) => {
            expect(arg.sender.toString()).toBe(payloadAnonym._id.toString())
            expect(arg.message).toBe('iamanonym')
            done()
        })
        clientAnonym.emit('sendMessage', { chatroomId, message: 'iamanonym' })
    })

})