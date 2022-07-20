import React from 'react'

export default function AudioPlayer(props) {
  return (
    <audio autoPlay className="media">
    <source src={props.src} type="audio/mpeg" />
    Your browser does not support MP3
  </audio>
  )
}
