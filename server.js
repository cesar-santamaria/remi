const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const { getToken, getPlaylist } = require('./helpers/spotify')
const ikea = require('ikea-name-generator');

const PORT = 8080;

//socket IO
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

let users = []


//Socket listeners
io.on('connection', socket => {
  console.log("User has connected")
  const name = ikea.getName();
  socket.name = name;
  users.push(name);

  socket.emit('INITIAL_CONNNECTION', { name, users });
  socket.broadcast.emit('NEW_USER', { name });

  socket.on('disconnect', () => {
    console.log('someone has disconnected')
    console.log(socket.name)
    users = users.filter(user => user !== socket.name);
    socket.broadcast.emit('DISCONNECTED_USER', { users })
  })
});

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(express.static('public'));

let token = ''
getToken().then((res) => token = res.data.access_token)

// Sample GET route
app.get('/api/data', (req, res) => {
  getPlaylist(token)
    .then(result => res.json({ src: result.data.tracks[0].preview_url }))
})

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`seems to be listening on port ${PORT} 🙉`);
});

