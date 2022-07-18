const express = require('express')
const app = express()
const BodyParser = require('body-parser')
const axios = require('axios')
const { getToken, getPlaylist } = require('./helpers/spotify')
const ikea = require('ikea-name-generator')
require('dotenv').config()

const PORT = 8080

//socket IO
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)

let users = []

//Socket listeners
io.on('connection', (socket) => {
  console.log('User has connected')
  const name = ikea.getName()
  socket.name = name
  users.push(name)

  socket.emit('INITIAL_CONNNECTION', { name, users })
  socket.broadcast.emit('NEW_USER', { name })

  socket.on('disconnect', () => {
    console.log('User has connected ', socket.handshake.query.username)
    users.push(socket.handshake.query.username)
    console.log('users: ', users)
  })
})

socket.on('Guess', guess => {
  socket.to(roomId).emit('chat-messages', `${user}: ${guess}`)
})

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())
app.use(express.static('public'))

let token = ''
getToken().then((res) => (token = res.data.access_token))

// Sample GET route
app.get('/api/data', (req, res) => {
  getPlaylist(token).then((result) =>
    res.json({ src: result.data.tracks[0].preview_url })
  )
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`seems to be listening on port ${PORT} 🙉`)
})
