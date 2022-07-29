import React, { useEffect, useState, useRef } from "react";
import { StyledTypoProps } from "../../Interfaces";
import TrackOutFwdBot from "../../styles/animations/tracking-out";

// material UI
import {
  Typography,
  Box,
  Slide,
  Grow,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Count = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "animate",
})<StyledTypoProps>(({ animate }) => ({
  fontSize: 88,
  ...(animate && {
    animation:
      animate &&
      `${TrackOutFwdBot()} 0.8s cubic-bezier(0.550, 0.085, 0.680, 0.530) both`,
  }),
}));

export const Countdown = () => {
  const [counter, setCounter] = useState<number>(5);
  const [trackOut, setTrackOut] = useState<boolean>(false);

  const containerRef = useRef(null);

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    setTrackOut(false);
    const countTimer: NodeJS.Timeout = setTimeout(() => {
      if (counter > 0) {
        setCounter(counter - 1);
      }
    }, 1000);
    const animationTimer: NodeJS.Timeout = setTimeout(() => {
      setTrackOut(true);
    }, 200);
    return () => {
      clearTimeout(animationTimer);
      clearTimeout(countTimer);
    };
  }, [counter]);

  return (
    <Slide direction="down" in={true} container={containerRef.current}>
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 1,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h2">Song starts in: </Typography>
        <Grow in={true} {...{ timeout: 500 }}>
          {(!matches && <Count animate={trackOut}>{counter}</Count>) || (
            <Count>{counter}</Count>
          )}
        </Grow>
      </Box>
    </Slide>
  );
};
