import React, { useRef, useState } from "react";
import { ILeaderboardCardProps, StyledBoxProps } from "../Interfaces";
import AnimationBounceLeft from "../styles/animations/bounce-left";

// material UI
import {
  Box,
  ListItem,
  Divider,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Slide,
  styled,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { gameBoardLight, gameBoardDark } from "../styles/theme";

const BouncingBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "animate",
})<StyledBoxProps>(({ animate }) => ({
  fontSize: 88,
  ...(animate && {
    animation: animate && `${AnimationBounceLeft()} 0.8s both`,
  }),
}));

const LeaderboardCard = (props: ILeaderboardCardProps) => {
  const [bounce, setBounce] = useState<boolean>(true);
  const containerRef: React.MutableRefObject<null> = useRef(null);

  let bgc = "";
  if (props.user.host && props.gameboardTheme === gameBoardLight)
    bgc = "#FAFAFA";
  if (props.user.host && props.gameboardTheme === gameBoardDark)
    bgc = "#171717";

  return (
    <Slide direction="right" in={true} container={containerRef.current}>
      <BouncingBox animate={bounce} sx={{ backgroundColor: bgc }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar
              src={props.user.avatar}
              sx={{ padding: 1, width: 80, height: 80 }}
            />
          </ListItemAvatar>
          <ListItemText
            sx={{ padding: 1 }}
            primary={props.user.username}
            secondary={`Score: ${props.user.score}`}
          />
          {props.user.winning && (
            <EmojiEventsIcon fontSize="large" sx={{ color: " #5400c5" }} />
          )}
        </ListItem>
        <Divider />
      </BouncingBox>
    </Slide>
  );
};

export default LeaderboardCard;
