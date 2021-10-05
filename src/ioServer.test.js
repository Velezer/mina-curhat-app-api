const db = require("./db")
jest.mock("./db")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")
const jwt = require("jwt-then")
jest.mock("jwt-then")


const Client = require("socket.io-client")
const createServer = require("./ioServer")

const server = createServer(db, bcrypt, jwt)
let port = 5555
server.listen(port)


const payloadAnonym = {
    name: 'anonym',
    role: 'anonym'
}
const payloadConsultant = {
    name: 'consultant',
    role: 'consultant'
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
        clientSocket.on('connected', (arg) => {
            expect(arg).toBe(`connected as ${payloadAnonym.role}`)
            done()
        })
    })

    it('join room', (done) => {
        clientSocket.on('joinedRoom', (arg) => {
            expect(arg).toBe(chatroomId)
            done()
        })
        clientSocket.emit('joinRoom', { chatroomId })
    })


    it('leave room', (done) => {
        clientSocket.on('leftRoom', (arg) => {
            expect(arg).toBe(chatroomId)
            done()
        })
        clientSocket.emit('leaveRoom', { chatroomId })
    })
})

describe('message socket', () => {
    let clientAnonym, clientConsultant

    beforeEach((done) => {
        jwt.verify.mockResolvedValueOnce(payloadAnonym)
        clientAnonym = new Client(`http://localhost:${port}`, {
            auth: {
                token: 'token-anonym'
            }
        })
        clientAnonym.on(`connected`, arg => {
            expect(arg).toBe(`connected as ${payloadAnonym.role}`)
            clientAnonym.emit('joinRoom', { chatroomId })
        })

        jwt.verify.mockResolvedValueOnce(payloadConsultant)
        clientConsultant = new Client(`http://localhost:${port}`, {
            auth: {
                token: 'token-consultant'
            }
        })
        clientConsultant.on(`connected`, arg => {
            expect(arg).toBe(`connected as ${payloadConsultant.role}`)
            clientConsultant.emit('joinRoom', { chatroomId })
        })
        done()
    })

    afterEach(() => {
        clientAnonym.close()
        clientConsultant.close()
    })


    it('consultant send message', (done) => {
        db.Message.prototype.save.mockResolvedValue()
        clientAnonym.on('newMessage', (arg) => {
            expect(arg.sender).toBe(payloadConsultant.name)
            expect(arg.role).toBe(payloadConsultant.role)
            expect(arg.message).toBe('iamconsultant')
            done()
        })
        clientConsultant.emit('sendMessage', { chatroomId, message: 'iamconsultant' })
    })

    it('anonym send message', (done) => {
        db.Message.prototype.save.mockResolvedValue()
        clientConsultant.on('newMessage', (arg) => {
            expect(arg.sender).toBe(payloadAnonym.name)
            expect(arg.role).toBe(payloadAnonym.role)
            expect(arg.message).toBe('iamanonym')
            done()
        })
        clientAnonym.emit('sendMessage', { chatroomId, message: 'iamanonym' })
    })

})