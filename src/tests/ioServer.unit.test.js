const db = require("../db")
jest.mock("../db")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")
const jwt = require("jwt-then")
jest.mock("jwt-then")


const Client = require("socket.io-client")
const createServer = require("../ioServer")

const server = createServer(db, bcrypt, jwt)
let port = 5555
server.listen(port)

const payloadAnonym = {
    _id: '_idanonym',
    name: 'anonym',
    model: 'Anonym',
    role: 'anonym'
}
const payloadConsultant = {
    _id: '_idconsultant',
    name: 'consultant',
    model: 'Consultant',
    role: 'consultant',
}
const chatroomId = 'chatroomId'


describe('ioApp auth-io & rooms', () => {
    let clientSocket

    beforeEach((done) => {
        clientSocket = new Client(`http://localhost:${port}`, {
            auth: {
                token: 'token'
            }
        })
        done()
    })

    afterEach(() => {
        clientSocket.close()
    })

    it('auth fail', (done) => {
        jwt.verify.mockRejectedValue(new Error('auth fail'))
        clientSocket.on('connect_error', (err) => {
            expect(err.message).toBe('auth fail')
            expect(err.data.code).toBe(401)
            done()
        })
    })
    it('auth success', (done) => {
        jwt.verify.mockResolvedValue(payloadAnonym)
        clientSocket.on('authenticated', (arg) => {
            expect(arg).toBe(`authenticated as ${payloadAnonym.role}`)
            done()
        })
    })


    it('join room & leave room', (done) => {
        clientSocket.on('joinedRoom', (arg) => {
            expect(arg).toBe(chatroomId)
        })
        clientSocket.emit('joinRoom', { chatroomId })

        clientSocket.on('leftRoom', (arg) => {
            expect(arg).toBe(chatroomId)
            done()
        })
        clientSocket.emit('leaveRoom', { chatroomId })
    })

})


describe('message socket', () => {
    let clientAnonym, clientConsultant

    beforeAll(done => {
        db.Chatroom.findOne.mockResolvedValue({
            _id: chatroomId,
            consultant: payloadConsultant._id,
            anonym: payloadAnonym._id
        })
        done()
    })

    beforeAll(done => {
        jwt.verify.mockResolvedValueOnce(payloadConsultant)
        clientConsultant = new Client(`http://localhost:${port}`, {
            auth: {
                token: 'token-consultant'
            }
        })
        clientConsultant.emit('joinRoom', { chatroomId })
        done()
    })

    beforeAll((done) => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
        clientAnonym = new Client(`http://localhost:${port}`, {
            auth: {
                token: 'token-anonym'
            }
        })
        clientAnonym.emit('joinRoom', { chatroomId })
        done()
    })

    afterAll(() => {
        clientAnonym.close()
        clientConsultant.close()
    })


    it('consultant send message', (done) => {
        clientAnonym.on('newMessage', (arg) => {
            expect(arg.message).toBe('iamconsultant')
            done()
        })
        clientConsultant.emit('sendMessage', { chatroomId, message: 'iamconsultant' })
    })

    it('anonym send message', (done) => {
        clientConsultant.on('newMessage', (arg) => {
            expect(arg.message).toBe('iamanonym')
            done()
        })
        clientAnonym.emit('sendMessage', { chatroomId, message: 'iamanonym' })
    })

})