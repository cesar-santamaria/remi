import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

import AudioPlayer from './AudioPlayer'
import UserForm from './components/UserForm'
import Game from './Game'

//Socket io client
import socketIOClient from 'socket.io-client'
const ENDPOINT = '/'

const App = () => {
  // Grab the window URL and set the Room ID to that url. URL should be formatted as localhost:3000/?[:roomId]
  const windowUrl = window.location.search
  const roomId = windowUrl.substring(1)
  const [username, setUsername] = useState('')
  const [user, setUser] = useState({
    username: '',
    roomId: roomId,
    score: 0,
  })
  const [users, setUsers] = useState([])
  const [socket, setSocket] = useState({})
  const [state, setState] = useState({
    message: 'Click the button to load data!',
    src: '',
  })

  const fetchData = () => {
    axios.get('/api/data').then((response) => {
      // handle success
      console.log(response.data)
      setState({
        ...state,
        src: response.data.src,
      })
    })
  }
  const createSocket = (user) => {
    socket = socketIOClient(ENDPOINT, {
      query: { username: user, roomId: roomId },
    })
    setUser((prev) => {
      return {
        ...prev,
        username: user,
        roomId: prev.roomId ? prev.roomId : roomId,
      }
    })
  }

  return (
    <div className="App">
      <h1>{state.message}</h1>
      <button onClick={fetchData}>Fetch Data</button>
      {state.src && <AudioPlayer src={state.src} />}

      {username ? (
        <Game user={user} socket={socket} />
      ) : (
        <UserForm createSocket={createSocket} />
      )}
    </div>
  )
}

export default App
