import React, { useState, useEffect, createContext } from "react";
import Leaderboard from "./components/LeaderBoard";
import GameBoard from "./components/game-board";
import Chatbox from "./components/Chatbox";

// material UI
import {
  IUser,
  ISocket,
  IGameProps,
  ITracklist,
  IArtistContext,
  IArtist,
  ITrack,
  IMessage,
} from "./Interfaces";
import { Box } from "@mui/material";

// theming for mobile
import { useTheme } from "@mui/material/styles";

// game modes
const ROUND: string = "ROUND";
const LOBBY: string = "LOBBY";
const COUNTDOWN: string = "COUNTDOWN";
const ENDOFROUND: string = "END_OF_ROUND";
const EOG: string = "END_OF_GAME";

const cheatCodes = [
  "Never Gonna Give You Up",
  "immacheater",
  "updownupdownab",
];

// context for artist searching
export const ArtistContext = createContext<IArtistContext>(
  {} as IArtistContext
);

const Game = (props: IGameProps) => {
  const socket: ISocket = props.socket;
  const user = props.user;
  const element = document.getElementById("songTrack")!;

  // Detecting mobile layouts
  const theme = useTheme();

  // game state
  const [audio] = useState<HTMLAudioElement>(element as HTMLAudioElement);
  const [users, setUsers] = useState<[IUser]>([user]);
  const [track, setTrack] = useState<ITrack>({} as ITrack);
  const [tracklist, setTracklist] = useState<ITracklist[] | []>([]);
  const [mode, setMode] = useState<string>(LOBBY);
  const [genre, setGenre] = useState<string>("pop");
  const [round, setRound] = useState<number>(0);
  const [artist, setArtist] = useState<string | null>("");
  const [artistList, setArtistList] = useState<IArtist[] | []>([]);
  const [artistError, setArtistError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessage[]>([
    {
      message: "Welcome to Remi!",
      username: "",
      avatar: "",
    },
  ]);

  useEffect(() => {
    socket.on("receive-chat-messages", (data: IMessage) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("update-user", (data: IUser) => {
      props.setUser(data);
    });

    socket.on("update-users", (data: [IUser]) => {
      setUsers(data);
    });

    socket.on("game-started", (data: number) => {
      setMode(COUNTDOWN);
    });

    socket.on("round-start", (data: number) => {
      setMode(ROUND);
      setRound(data);
    });

    socket.on("next-round", (data: ITrack) => {
      setTrack(data);
      setMode(COUNTDOWN);
    });

    socket.on("next-track", (data: ITrack) => {
      setTrack(data);
    });

    socket.on("end-of-game", (data: string) => {
      setMode(EOG);
    });
    socket.on("start-new-game", (data: string) => {
      setMode(LOBBY);
    });

    socket.on("track-list", (data: ITracklist[] | []) => {
      setTracklist(data);
    });

    socket.on("artist-list", (data: IArtist[] | []) => {
      setArtistList(data);
    });

    socket.on("error", (data: string) => {
      setArtistError(true);
      const timeout: NodeJS.Timeout = setTimeout(() => {
        setArtistError(false);
      }, 4000);
      return () => clearTimeout(timeout);
    });

    return () => socket.disconnect();
  }, [socket]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message === "") return;

    const cheat = cheatCodes.find((m) => m === message);
    console.log(`${props.user.username}: ${message}`);

    if (mode === ROUND) {
      if (message === track.name || cheat) {
        let roundScore: number =
          ((Number(audio.duration) - Number(audio.currentTime)) * 2000) /
          Number(audio.duration);
        roundScore = Math.round(roundScore);
        props.setUser({ ...user, score: roundScore });
        socket.emit("correct-answer", roundScore);
        return;
      }
    }
    socket.emit("send-chat-message", message);
  };

  const startGame = (rounds: number) => {
    let artistId = artist ? artist : "";
    socket.emit("start-game", genre, rounds, artistId);
  };

  const endOfRound = () => {
    socket.emit("end-of-round", "end-of-round");
    setMode(ENDOFROUND);
  };

  const newGame = () => {
    socket.emit("new-game", "new-game");
  };

  const selectGenre = (newGenre: string) => {
    if (newGenre !== "advanced-settings" && newGenre !== null) {
      setGenre(newGenre);
    }
  };

  const queryArtist = (searchParams: string): void => {
    if (searchParams.length === 0) {
      return;
    }
    socket.emit("search-artist", encodeURIComponent(searchParams));
    return;
  };

  const context: IArtistContext = {
    artist,
    setArtist,
    artistList,
    setArtistList,
    artistError,
    queryArtist,
  };

  return (
    <Box
      sx={{
        display: "grid",
        gap: 0,
        gridTemplateColumns: "repeat(4, 1fr)",
        [theme.breakpoints.down("md")]: {
          gridTemplateColumns: "1fr",
          height: "100vh",
        },
      }}
    >
      <Box>
        <Leaderboard users={users} gameboardTheme={props.gameboardTheme} />
      </Box>
      <Box sx={{ gridColumn: "span 2" }}>
        <ArtistContext.Provider value={context}>
          <GameBoard
            roomId={props.user.roomId}
            selectGenre={selectGenre}
            startGame={startGame}
            mode={mode}
            track={track}
            audio={audio}
            endOfRound={endOfRound}
            users={users}
            round={round}
            host={user.host}
            newGame={newGame}
            gameboardTheme={props.gameboardTheme}
          />
        </ArtistContext.Provider>
      </Box>
      <Box>
        <Chatbox
          tracklist={tracklist}
          message={message}
          sendMessage={sendMessage}
          setMessage={setMessage}
          messages={messages}
          mode={mode}
          gameboardTheme={props.gameboardTheme}
        />
      </Box>
    </Box>
  );
};

export default Game;
