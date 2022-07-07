const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const PORT = 8080;

//socket IO
const socketio = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketio(server);

//Socket listeners
io.on('connection', socket => {
  console.log("User has connected")
  console.log(socket)
});

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());
app.use(express.static('public'));

// Sample GET route
app.get('/api/data', (req, res) => res.json({
  message: "Seems to work!",
  
}));

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`seems to be listening on port ${PORT} 🙉`);
});

