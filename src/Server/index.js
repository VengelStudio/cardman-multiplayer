var app = require('http').createServer()
var io = (module.exports.io = require('socket.io')(app, { pingInterval: 2000 }))

//process.env.PORT ||
const PORT = 3231

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}.`)
})
