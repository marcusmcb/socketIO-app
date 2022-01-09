const express = require('express')
const app = express()
const socketio = require('socket.io')
const cors = require('cors')

app.use(cors())
app.use(express.static(__dirname + '/public'))

const PORT = process.env.PORT || 8000

const expressServer = app.listen(PORT, () => console.log(`Server listening on ${PORT}`))
const io = socketio(expressServer)

io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'Welcome to the SocketIO server.' })
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient)
  })
  socket.on('newMessageToServer', (msg) => {
    io.emit('messageToClients', { text: msg.text })
    // io.of('/').emit('messageToClients', {text: msg.text})
  })
})

io.of('/admin').on('connection', (socket) => {
  console.log('Admin namespace connected.')
  io.of('/admin').emit('welcome', 'Welcome to the admin channel.')
})
