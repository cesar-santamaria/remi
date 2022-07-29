import React from "react";
import { IEndOfGameProps, IUser } from "../../Interfaces";

// material UI
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export const EndOfGame = (props: IEndOfGameProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const sortedUsers: IUser[] = props.users.sort(
    (a: IUser, b: IUser): number => b.score - a.score
  );

  // displays final scoreboard
  const users: JSX.Element[] = sortedUsers.map((user: IUser, i: number) => {
    let bgc = "#F4F4FF";
    if (i === 2) bgc = "#5b6bff";
    if (i === 1) bgc = "#5d03ea";
    if (i === 0) bgc = "#5400c5";
    const tc = i > 2 ? "black" : "white";

    return (
      <Box
        key={i}
        sx={{
          width: "35vw",
          color: tc,
          backgroundColor: bgc,
          borderRadius: 2,
          margin: 2,
          [theme.breakpoints.down("md")]: {
            width: "85vw",
            margin: 1,
          },
        }}
      >
        <ListItem>
          <ListItemText
            sx={{ padding: 1, width: "2vh", fontSize: 38 }}
            primary={<Typography variant="h6">#{i + 1}</Typography>}
          />
          <ListItemAvatar>
            <Avatar
              src={user.avatar}
              sx={{
                padding: 1,
                width: 80,
                height: 80,
                [theme.breakpoints.down("md")]: {
                  width: 50,
                  height: 50,
                },
              }}
            />
          </ListItemAvatar>
          <ListItemText
            sx={{ padding: 1, width: "10vh" }}
            primary={<Typography variant="h6">{user.username}</Typography>}
          />
          <ListItemText
            sx={{ padding: 1, width: "10vh" }}
            primary={<Typography variant="h6">Score: {user.score}</Typography>}
          />
        </ListItem>
      </Box>
    );
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100vh",
        overflow: "scroll",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {!matches && (
        <Typography
          variant="h4"
          component="h4"
          sx={{
            mr: 2,
            fontWeight: 700,
            fontSize: 50,
            letterSpacing: ".3rem",
            color: "#5400c3",
            textDecoration: "none",
          }}
        >
          Game Over
        </Typography>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {users}
      </Box>
      <Button
        variant="contained"
        size="large"
        disabled={!props.host}
        onClick={props.newGame}
        sx={{ color: "white" }}
      >
        New Game
      </Button>
    </Box>
  );
};
