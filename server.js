const http = require('http')
const app = require('./app')

const port = process.env.port || 3000

const server = http.createServer(app)

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error
    }
}

server.on('error', errorHandler)
server.on('listening', () => {
    const address = server.address()
    console.log('Listening on :' + port)
})

server.listen(port)