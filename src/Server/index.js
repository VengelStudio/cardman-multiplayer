const path = require('path')
const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = (module.exports.io = require('socket.io')(server, {
    pingInterval: 2000
}))
const port = process.env.PORT || 3231
const SocketManager = require('./SocketManager')

app.use(express.static(path.join(__dirname, '../../build')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build/index.html'), err => {
        if (err) {
            res.status(500).send(err)
        }
    })
})

io.on('connection', SocketManager)

server.listen(port, () => {
    console.log(`Server started on port ${port}.`)
})
