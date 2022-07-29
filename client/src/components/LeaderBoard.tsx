import React from "react";
import { IUser, ILeaderboardProps } from "../Interfaces";
import LeaderboardCard from "./LeaderboardCard";

// material UI
import {
  List,
  Box,
  Divider,
  Typography,
  Grow,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { gameBoardLight } from "../styles/theme";

const Leaderboard = (props: ILeaderboardProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const bgc: string =
    props.gameboardTheme === gameBoardLight ? "#FFFFFF" : "#121212";

  const sortedUsers: IUser[] = props.users.sort(
    (a: IUser, b: IUser): number => b.score - a.score
  );

  // displays each user on leaderboard
  const users: JSX.Element[] = sortedUsers.map((user: IUser, i: number) => {
    return (
      <LeaderboardCard
        key={i}
        user={user}
        gameboardTheme={props.gameboardTheme}
      />
    );
  });

  return (
    <Grow in={true} {...{ timeout: 1000 }}>
      <Box
        sx={{
          backgroundColor: bgc,
          borderRadius: 2,
          margin: 1,
          padding: 2,
          height: "90vh",
          boxShadow: 5,
          overflow: "scroll",
          overflowX: "hidden",
          overflowY: "auto",
          [theme.breakpoints.down("md")]: {
            height: "18vh",
          },
        }}
      >
        {!matches && (
          <Typography variant="h6" component="h6" align="left">
            Room ID: {props.users[0].roomId}
          </Typography>
        )}
        <List>
          {!matches && <Divider />}
          {users}
        </List>
      </Box>
    </Grow>
  );
};

export default Leaderboard;
