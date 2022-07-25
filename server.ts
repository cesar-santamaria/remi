const express = require('express')
const app = express()
const BodyParser = require('body-parser')
import { AxiosResponse } from "axios";
const { getToken, getPlaylist } = require('./helpers/spotify')
const ikea = require('ikea-name-generator')
require('dotenv').config()
const PORT = 8080


//socket IO
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io = socketio(server)

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())
app.use(express.static('public'))

let token = ''
getToken().then((res:any) => (token = res.data.access_token))


// Sample GET route
app.get('/api/data', (req:any, res:any) => {
  getPlaylist(token).then((result:any) =>
    res.json({ src: result.data.tracks[0].preview_url })
  )
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`seems to be listening on port ${PORT} 🙉`)
})

let users:any = []

//Socket listeners
io.on('connection', (socket:any) => {
  const user = socket.handshake.query.username;
  const roomId = socket.handshake.query.roomId;
  console.log('User has connected', user )
  users.push(user)
  console.log("users: ", users)
  socket.join(roomId);

  socket.emit('INITIAL_CONNNECTION', { name, users })
  socket.broadcast.emit('NEW_USER', { name })

  socket.on('Guess', (guess:any) => {
    socket.to(roomId).emit('chat-messages', `${user}: ${guess}`)
  })
})