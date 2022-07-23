import React, { useState, useEffect } from 'react'
import { ISocket } from './interfaces/AppInterfaces'
import { IGameProps } from './interfaces/GameInterfaces'

const Game = (props: IGameProps) => {
  const socket: ISocket = props.socket
  const [guess, setGuess] = useState<string>('')

  const sendGuess = (e: React.FormEvent<HTMLFormElement>) => {
    socket.emit('Guess', guess)
    console.log('Guess sent')
  }

  useEffect(() => {
    socket.on('chat-messages', (message: string) => {
      console.log(message)
    })
  }, [])

  return (
    <>
      <h2> THE GAME </h2>
      <form onSubmit={(e) => sendGuess(e)}>
        <input
          type="text"
          id="guess"
          placeholder="Enter guess"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
export default Game
