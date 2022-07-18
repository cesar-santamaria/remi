import React, { useState, useEffect } from 'react';

export default function Game() {
  const socket  = props.socket
  useEffect(() => {
    console.log("This useEffect runs only once!")

  }, [socket]);
  return (
    <div>Game</div>
  )
}
