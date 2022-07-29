import React, { useState } from "react";
import { IGameBoard } from "../../Interfaces";
import { GameLobby } from "./GameLobby";
import { Countdown } from "./Countdown";
import { PlayGame } from "./PlayGame";
import { EndOfRound } from "./EndOfRound";
import { EndOfGame } from "./EndOfGame";

// material UI
import { Box, Grow } from "@mui/material";
import { gameBoardLight } from "../../styles/theme";
import { useTheme } from "@mui/material/styles";

const GameBoard = (props: IGameBoard) => {
  const theme = useTheme();
  const bgc: string =
    props.gameboardTheme === gameBoardLight ? "#FFFFFF" : "#121212";
  const [volume, setVolume] = useState<
    number | string | Array<number | string>
  >(50);

  return (
    <Grow in={true} {...{ timeout: 1000 }}>
      <Box
        sx={{
          margin: 1,
          padding: 2,
          height: "90vh",
          [theme.breakpoints.down("md")]: {
            height: "45vh",
          },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          boxShadow: 5,
          backgroundColor: bgc,
        }}
      >
        {props.mode === "LOBBY" && (
          <GameLobby
            roomId={props.roomId}
            selectGenre={props.selectGenre}
            startGame={props.startGame}
            host={props.host}
          />
        )}
        {props.mode === "COUNTDOWN" && <Countdown />}
        {props.mode === "ROUND" && (
          <PlayGame
            track={props.track}
            endOfRound={props.endOfRound}
            audio={props.audio}
            round={props.round}
            volume={volume}
            setVolume={setVolume}
          />
        )}
        {props.mode === "END_OF_ROUND" && (
          <EndOfRound
            users={props.users}
            track={props.track}
            round={props.round}
          />
        )}
        {props.mode === "END_OF_GAME" && (
          <EndOfGame
            users={props.users}
            newGame={props.newGame}
            host={props.host}
          />
        )}
      </Box>
    </Grow>
  );
};

export default GameBoard;
