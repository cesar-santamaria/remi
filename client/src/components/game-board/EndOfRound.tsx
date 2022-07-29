import React from "react";
import { IEndOfRoundProps, IUser } from "../../Interfaces";

// material UI
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export const EndOfRound = (props: IEndOfRoundProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const songTitle = props.track.name;

  const sortedUsers: IUser[] = props.users.sort(
    (a: IUser, b: IUser): number => b.roundScore - a.roundScore
  );

  // displays per round scoreboard
  const users: JSX.Element[] = sortedUsers.map((user: IUser, i: number) => {
    const bgc = i === 0 && user.roundScore !== 0 ? "#5400c5" : "#F4F4FF";
    const tc = i === 0 && user.roundScore !== 0 ? "white" : "green";
    return (
      <Box
        sx={{
          backgroundColor: bgc,
          width: "35vw",
          [theme.breakpoints.down("md")]: {
            width: "85vw",
          },
          borderRadius: 2,
          margin: 2,
        }}
        key={i}
      >
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={user.avatar}
              sx={{ padding: 1, width: 50, height: 50 }}
            />
          </ListItemAvatar>
          {i === 0 && user.roundScore !== 0 ? (
            <ListItemText
              sx={{ padding: 1, width: "10vw" }}
              primary={
                <Typography variant="h6" style={{ color: tc }}>
                  {user.username}
                </Typography>
              }
            />
          ) : (
            <ListItemText
              sx={{ padding: 1, width: "10vw", color: "black" }}
              primary={user.username}
            />
          )}

          <ListItemText
            sx={{ padding: 1 }}
            primary={
              <Typography variant="h6" style={{ color: tc }}>
                Score: + {user.roundScore}
              </Typography>
            }
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            marginRight: 4,
            height: 200,
            width: 200,
            border: 3,
            borderRadius: 2,
            [theme.breakpoints.down("md")]: {
              height: 150,
              width: 150,
              marginRight: 1,
            },
          }}
          src={props.track.album.images[0].url}
        />

        <ListItemText
          sx={{ fontSize: 20, padding: 2 }}
          primary={"The song title was:"}
          secondary={songTitle.split("(")[0]}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!matches ? users : users[0]}
      </Box>
    </Box>
  );
};
