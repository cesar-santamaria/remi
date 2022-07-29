import React from "react";
import { IAudioProps } from "../Interfaces";

const AudioPlayer = (props: IAudioProps) => {
  return (
    <div>
      <audio autoPlay className="media" id="songTrack">
        <source src={props.src} type="audio/mpeg" />
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

export default AudioPlayer;
