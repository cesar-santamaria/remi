import React, { useState } from "react";
import { IUserFormProps, IUser } from "../Interfaces";

// helpers
import { getUrlParams } from "../helpers/roomGenerator";

// material UI
import {
  Container,
  CssBaseline,
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Grow,
  Alert,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

// assets
import p1 from "../assets/p1.png";
import p2 from "../assets/p2.png";
import p3 from "../assets/p3.png";
import p4 from "../assets/p4.png";
import p5 from "../assets/p5.png";
import p6 from "../assets/p6.png";
import p7 from "../assets/p7.png";
import p8 from "../assets/p8.png";
import p9 from "../assets/p9.png";
import p10 from "../assets/p10.png";
import p11 from "../assets/p11.png";
import p12 from "../assets/p12.png";
import p13 from "../assets/p13.png";
import p14 from "../assets/p14.png";


const UserForm = (props: IUserFormProps) => {
  const cartoons = [
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
    p9,
    p10,
    p11,
    p12,
    p13,
    p14,
  ];
  const [cartoonIndex, setCartoonIndex] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([0]);
  const [user, setUser] = useState<IUser>({
    id: "",
    username: "",
    roomId: "",
    score: 0,
    roundScore: 0,
    avatar: cartoons[cartoonIndex],
    host: false,
    winning: false,
  });
  const [roomId, setRoomId] = useState<string>(getUrlParams());

  const nextAvatar = (): void => {
    const currentHistory = [...history];
    let newCartoonIndex: number = cartoonIndex;
    newCartoonIndex++;

    if (newCartoonIndex < cartoons.length) {
      setHistory([...currentHistory, newCartoonIndex]);
      setCartoonIndex(newCartoonIndex);
      setUser({ ...user, avatar: cartoons[newCartoonIndex] });
    }
  };

  const prevAvatar = (): void => {
    const currentHistory: number[] = [...history];

    if (history.length > 1) {
      currentHistory.pop();
      setHistory(currentHistory);
      const prevCartoonIndex = currentHistory[currentHistory.length - 1];
      setCartoonIndex(prevCartoonIndex);
      setUser({ ...user, avatar: cartoons[prevCartoonIndex] });
    }
  };

  // submit new user form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (user.username === "") {
      return;
    }
    props.createSocket(user);
  };

  return (
    <Grow in={true} {...{ timeout: 1000 }}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowBack
            onClick={prevAvatar}
            sx={{ width: 30, height: 30, color: "#f1c412" }}
          ></ArrowBack>

          <Avatar
            src={cartoons[cartoonIndex]}
            sx={{ padding: 2, width: 150, height: 150 }}
          />

          <ArrowForward
            onClick={nextAvatar}
            sx={{ width: 30, height: 30, color: "#f1c412" }}
          ></ArrowForward>
        </Box>

        <Typography component="h1" variant="h6" color="#f1c412">
          Choose your character
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            inputProps={{ style: { color: "white", borderColor: "white" } }} 
            autoFocus
            sx={{
              "& .MuiInputLabel-root": {color: '#f1c412'},
              "& .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "#f1c412" },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "#f1c412" },
              },
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            name="room-id"
            label="Enter Room ID (Optional)"
            type="room-id"
            id="room-id"
            value={roomId}
            autoComplete="room-id"
            onChange={(e) => {
              setUser({ ...user, roomId: e.target.value });
              setRoomId(e.target.value);
            }}
            inputProps={{ style: { color: "white" } }} 
            sx={{
              "& .MuiInputLabel-root": {color: '#f1c412'},
              "& .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "#f1c412" },
              },
              "&:hover .MuiOutlinedInput-root": {
                "& > fieldset": { borderColor: "#f1c412" },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, color: "black" }}
          >
            {roomId ? "Join" : "Start Game"}
          </Button>
          {props.status === "full" && <Alert severity="error">Room full</Alert>}
        </Box>
      </Container>
    </Grow>
  );
};

export default UserForm;
