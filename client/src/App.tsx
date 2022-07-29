import React, { useState, useEffect } from "react";
import { IUser, ISocket, ITheme, IAppProps } from "./Interfaces";
import Game from "./Game";
import Loading from "./Loading";
import NavBar from "./components/NavBar";
import UserForm from "./components/UserForm";
import AudioPlayer from "./components/AudioPlayer";
import Footer from "./components/Footer";
import "./App.css";

// material UI
import { ThemeProvider } from "@mui/material/styles";
import {
  lightTheme,
  darkTheme,
  gameBoardLight,
  gameBoardDark,
  navTheme,
} from "./styles/theme";

// generates a room id
import { getRoomId } from "./helpers/roomGenerator";
import { CssBaseline, Box } from "@mui/material";

// socket io client
import { io } from "socket.io-client";
const ENDPOINT = "/";

const App = (props: IAppProps) => {
  // grab the window URL and set the Room ID to that url. URL should be formatted as localhost:3000/?[:roomId]
  const roomId: string = getRoomId();

  // create a colour palette for the App
  const [user, setUser] = useState<IUser>({
    id: "",
    username: "",
    roomId: roomId,
    avatar: "",
    score: 0,
    roundScore: 0,
    host: false,
    winning: false,
  });
  const [socket, setSocket] = useState<ISocket>({} as ISocket);
  const [theme, setTheme] = useState<ITheme>(lightTheme);
  const [gameboardTheme, setGameboardTheme] = useState<ITheme>(gameBoardLight);
  const [status, setStatus] = useState<string>("");

  const createSocket = (createUser: IUser): void => {
    setStatus("");
    const newRoomId = createUser.roomId ? createUser.roomId : user.roomId;
    setUser((prev) => {
      return {
        ...prev,
        username: createUser.username,
        roomId: newRoomId,
        avatar: createUser.avatar,
      };
    });
    setSocket(
      io(ENDPOINT, {
        query: {
          username: createUser.username,
          roomId: newRoomId,
          avatar: createUser.avatar,
        },
      })
    );
  };

  // switches between light and dark mode
  const changeTheme = (): void => {
    if (theme === lightTheme) {
      setTheme(darkTheme);
      setGameboardTheme(gameBoardDark);
      return;
    }
    setTheme(lightTheme);
    setGameboardTheme(gameBoardLight);
  };

  return (
    <ThemeProvider theme={theme}>
      <ThemeProvider theme={navTheme}>
        <NavBar changeTheme={changeTheme} theme={theme} />
      </ThemeProvider>
      <div className="App" style={{backgroundColor: '#5400c5'}}>
        <AudioPlayer src={""} />
        {user.username && status !== "full" ? (
          status === "success" ? (
            <ThemeProvider theme={gameboardTheme}>
              <CssBaseline />
              <Game
                user={user}
                socket={socket}
                setUser={setUser}
                gameboardTheme={gameboardTheme}
              />
            </ThemeProvider>
          ) : (
            <Box
              sx={{
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loading setStatus={setStatus} socket={socket} />
            </Box>
          )
        ) : (
          <Box
            sx={{
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserForm createSocket={createSocket} status={status} />
          </Box>
        )}
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
