const express = require('express')
const app = express()
const BodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
require('dotenv').config()

const PORT: number = Number(process.env.PORT) || 8080

import { AxiosResponse } from 'axios'
import { CorsOptions } from 'cors'
import { Express } from 'express'
import { IArtist, Irooms, Itracks } from './interface'
import { createServer } from 'http'
import { Server } from 'socket.io'

const whitelist: string[] = ['http://localhost:3000', 'http://localhost:8081']

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

// helper functions
const {
  getToken,
  getPlaylist,
  filterTitles,
  createAutocomplete,
  queryArtist,
} = require('./helpers/spotify')
const { getTrack, findRoomIndex, findUserIndex } = require('./helpers/game')
const sampleSonglist = require('./helpers/autocompleteSongs')

// Server set up
const server = createServer(app)
const io = new Server(server)

// Express Configuration
app.use(BodyParser.urlencoded({ extended: false }))
app.use(BodyParser.json())
app.use(express.static('public'))
app.use(cors(corsOptions))

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'react-front-end/build')))
  // Handle React routing, return all requests to React app
  app.get('*', function (req: any, res: any) {
    res.sendFile(path.join(__dirname, 'react-front-end/build', 'index.html'))
  })
}

server.listen(PORT, () => {
  console.log(`seems to be listening on port ${PORT} 🙉`)
})

// global variables
let token: string = ''
let rooms: Irooms[] = []
const maxNumPlayers: number = 8

// retrieves authentication token from spotify
getToken().then((res: AxiosResponse) => {
  token = res.data.access_token
})

setInterval(() => {
  getToken().then((res: AxiosResponse) => {
    token = res.data.access_token
  })
}, 3.5e6)

/* New socket CONNECTION established to server from client
 * @params - {Socket object}: Socket
 *          {Socket.handshake.query}: username {string}, roomId {number}, avatar{ulr}
 * From the given roomId determine if the room already exists (findRoomIndex())
 *  - IF it doesn't then create a new room and push the connected user in the users array
 *  - ELSE push the connected user into the users array within the current room (roomIndex)
 *
 * @return - <message>: 'update-users' - Send a socket emit to the room, updating the clients with the user information
 */
io.on('connection', (socket) => {
  let { username, roomId, avatar } = socket.handshake.query
  let roomIndex = findRoomIndex(rooms, roomId)

  if (!roomId || Array.isArray(roomId)) {
    return
  }
  if (!username || Array.isArray(username)) {
    return
  }
  if (!avatar || Array.isArray(avatar)) {
    return
  }

  if (roomIndex === -1) {
    rooms.push({
      id: roomId,
      tracks: [],
      titles: [],
      currentTrack: {} as Itracks,
      rounds: 0,
      currentRound: 1,
      users: [
        {
          id: socket.id,
          username,
          roomId,
          avatar,
          score: 0,
          roundScore: 0,
          host: true,
          winning: false,
        },
      ],
    })
    roomIndex = findRoomIndex(rooms, roomId)
    io.to(socket.id).emit('joined-room', 'success')
  } else {
    if (rooms[roomIndex].users.length >= maxNumPlayers) {
      return io.to(socket.id).emit('room-full', 'Room is full')
    }
    rooms[roomIndex].users.push({
      id: socket.id,
      username,
      roomId,
      avatar,
      score: 0,
      roundScore: 0,
      host: false,
      winning: false,
    })
    io.to(socket.id).emit('joined-room', 'success')
  }

  let userIndex = findUserIndex(rooms[roomIndex], socket.id)
  socket.join(roomId)

  // io.in(roomId).emit("update-users", rooms[roomIndex]?.users);
  io.in(rooms[roomIndex]?.id).emit('update-users', rooms[roomIndex]?.users)
  io.to(socket.id).emit('update-user', rooms[roomIndex]?.users[userIndex])

  /* NEW GAME message sent to the sever.
   * @params - <message>: 'new-game'
   *
   * The host has started a new game with the existing clients. Zero the score before transitioning back to the lobby
   *
   * @return - <message>: 'update-users', {users[]} - Update all clients in the room with the zeroed scores
   * @return - <message>: 'start-new-game' - Instruct all users to transition to the LOBBY mode
   */
  socket.on('new-game', () => {
    rooms[roomIndex].currentRound = 1
    rooms[roomIndex]?.users.forEach((u) => {
      u.score = 0
      u.roundScore = 0
    })
    io.in(rooms[roomIndex]?.id).emit('update-users', rooms[roomIndex]?.users)
    io.in(rooms[roomIndex]?.id).emit('start-new-game', 'new-game')
  })

  /* START GAME message sent to the sever.
   * @params - <message>: 'new-game', {genre, rounds} - the genre and number of rounds selected for the game
   *
   * The host has started thr game. Use the provided genre to call the Spotify API and generate tracks.
   *  getPlaylist(token, genre)
   * Grab a track to play from that list. getTrack(rooms, roomId)
   * Update the room with the number of selected rounds.
   * Create an list of red-herring songs for autocorrect input field.
   *
   * @return - <message>: 'next-track', {track} - Update all clients in the room with the track to be played next
   * @return - <message>: 'track-list' -  Update all clients in the room with a list of titles to use for autocomplete
   * @return - <message>: 'game-started' - Instruct all users to transition to the COUNTDOWN mode
   * @return - 5 second delay - <message>: 'round-start' - Instruct all users to transition to the ROUND mode to start the round
   */
  socket.on('start-game', (genre: string, rounds: number, artist: string) => {
    getPlaylist(token, genre, artist).then((result: AxiosResponse) => {
      const tracks: Itracks[] = result.data.tracks.filter(
        (t: Itracks) => t.preview_url !== null
      )
      const titles = filterTitles(tracks)

      rooms[roomIndex] = { ...rooms[roomIndex], tracks, titles, rounds }
      if (!roomId || Array.isArray(roomId)) {
        return
      }

      if (tracks.length >= rooms[roomIndex].rounds) {
        const nextTrack = getTrack(rooms, roomId)
        const autocomplete = createAutocomplete(sampleSonglist, titles)

        io.to(roomId).emit('next-track', nextTrack)
        io.to(roomId).emit('track-list', autocomplete)

        io.to(roomId).emit('game-started', roomId)
        setTimeout(() => {
          if (rooms[roomIndex] === undefined) return
          io.to(rooms[roomIndex]?.id).emit(
            'round-start',
            rooms[roomIndex]?.currentRound
          )
        }, 5000)
      } else {
        io.to(roomId).emit('error', 'Please select a different artist.')
      }
    })
  })

  /* END OF ROUND message sent to the sever.
   * @params - <message>: 'end-of-round'
   *
   * From the given roomId determine if the room already exists (findRoomIndex())
   *  - IF it doesn't then create a new room and push the connected user in the users array
   *  - ELSE push the connected user into the users array within the current room (roomIndex)
   *
   * @return
   * - IF the room round = current round - <message>: 'end-of-game'
   *          - send message to clients in the room the game is over
   *  - ELSE  - 10 second delay - <message>: 'end-of-game',  {nextTrack} next track to play
   *            - send message to clients in the room to go to the next round, provide new track
   *          - 15 second delay - <message>: 'round-start',  {currentRound} current round
   *          - Update the client with the current round and direct them to start the round
   */
  socket.on('end-of-round', () => {
    userIndex = findUserIndex(rooms[roomIndex], socket.id)

    if (!rooms[roomIndex]?.users[userIndex].host) return
    rooms[roomIndex].currentRound++

    if (rooms[roomIndex]?.currentRound === rooms[roomIndex]?.rounds + 1) {
      return setTimeout(() => {
        if (!roomId || Array.isArray(roomId)) {
          return
        }
        if (rooms[roomIndex] === undefined) return
        io.in(roomId).emit('end-of-game', 'End of Game')
      }, 10000)
    }

    const nextTrack = getTrack(rooms, roomId)
    setTimeout(() => {
      if (rooms[roomIndex] === undefined) return
      rooms[roomIndex]?.users.forEach((user) => {
        user.roundScore = 0
      })
      if (!roomId || Array.isArray(roomId)) {
        return
      }
      io.in(roomId).emit('next-round', nextTrack)
    }, 10000)

    setTimeout(() => {
      // After the 5 second countdown, Tell clients to play track and start guessing
      if (rooms[roomIndex] === undefined) return
      if (!roomId || Array.isArray(roomId)) {
        return
      }
      io.to(roomId).emit('round-start', rooms[roomIndex]?.currentRound)
    }, 15000)
  })

  /* CORRECT ANSWER message sent to the sever.
   * @params - <message>: 'correct-answer'
   * @params - {score}: The score the user received for guessing the correct answer
   *
   * @return - <message>: 'update-users' - Update all clients in the room with the updated scores
   * @return - <message>: 'receive-chat-messages' - Update all clients in the room with a message stating a corrent answer was sumbitted by the user
   */
  socket.on('correct-answer', (score: number) => {
    if (!roomId || Array.isArray(roomId)) {
      return
    }
    userIndex = findUserIndex(rooms[roomIndex], socket.id)

    if (rooms[roomIndex]?.users[userIndex].roundScore) return

    rooms[roomIndex].users[userIndex].score += score
    rooms[roomIndex].users[userIndex].roundScore = score

    rooms[roomIndex]?.users.sort((a, b) => b.score - a.score)
    rooms[roomIndex].users[0].winning = true
    if (rooms[roomIndex]?.users.length > 1) {
      for (let i = 1; i < rooms[roomIndex]?.users.length; i++) {
        rooms[roomIndex].users[i].winning = false
      }
    }

    io.in(roomId).emit('update-users', rooms[roomIndex]?.users)

    io.in(roomId).emit('receive-chat-messages', {
      username,
      message: `Correct guess! Scored: ${score}`,
      avatar,
    })
  })

  /* SEND CHAT MESSAGE message sent to the sever.
   * @params - <message>: 'send-chat-message'
   * @params - {message}: The message sent by the socket (client)
   *
   * @return - <message>: 'receive-chat-messages' {username, message, avatar} - Update all clients in the room with a message sent by the socket
   */
  socket.on('send-chat-message', (message: string) => {
    io.in(rooms[roomIndex]?.id).emit('receive-chat-messages', {
      username,
      message,
      avatar,
    })
  })
})
