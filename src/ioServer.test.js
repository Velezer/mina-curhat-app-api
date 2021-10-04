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


describe('ioApp with auth', () => {
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

    describe('auth-io', () => {
        const payloadAnonym = {
            name: 'anonym',
            role: 'anonym'
        }
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
    })

})