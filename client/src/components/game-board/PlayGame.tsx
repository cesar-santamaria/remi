import React, { useState, useEffect } from "react";
import { IPlayGameProps } from "../../Interfaces";

// material UI
import {
  Box,
  Slider,
  Stack,
  Typography,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeDown from "@mui/icons-material/VolumeDown";

export const PlayGame = (props: IPlayGameProps) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("md"));

  const [blur, setBlur] = useState<number>(10);
  const [progress, setProgress] = useState<number>(0);

  // updates progress bar
  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => {
      setProgress((props.audio.currentTime / props.audio.duration) * 100);
      setBlur(10 - (props.audio.currentTime / props.audio.duration) * 10);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    props.audio.src = props.track.preview_url;
    handleVolumeChange(new Event("volume"), Number(props.volume));
    props.audio.play();
    props.audio.onended = () => {
      props.endOfRound();
    };
  }, []);

  // volume adjustments
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    props.setVolume(newValue);
    const volumeConversion = Number(newValue) / 100;
    if (volumeConversion === 0.0) {
      props.audio.volume = 0;
    }
    props.audio.volume = volumeConversion / 10;
  };

  const handleVolumeMin = (): void => {
    props.setVolume(0);
    props.audio.volume = 0;
  };

  const handleVolumeMax = (): void => {
    props.setVolume(100);
    props.audio.volume = 0.1;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!matches && (
          <Typography
            variant="h4"
            component="h4"
            sx={{
              fontWeight: 700,
              fontSize: 50,
              [theme.breakpoints.down("md")]: {
                fontSize: "2em",
              },
              letterSpacing: ".3rem",
              color: "#5400c3",
              textDecoration: "none",
             
            }}
          >
            Guess the song!
          </Typography>
        )}

        {(!matches && (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ROUND {props.round}
          </Typography>
        )) || (
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GUESS THE SONG - ROUND {props.round}
          </Typography>
        )}
      </Box>

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
            height: 200,
            width: 200,
            border: 3,
            borderRadius: 2,
            filter: `blur(${blur}px)`,
            [theme.breakpoints.down("md")]: {
              height: 150,
              width: 150,
            },
          }}
          src={props.track.album.images[0].url}
        />
      </Box>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 20,
          width: "30vw",
          [theme.breakpoints.down("md")]: {
            width: "60vw",
          },
        }}
      />

      <Stack spacing={2} direction="row">
        <VolumeDown onClick={handleVolumeMin} />
        <Slider
          aria-label="Volume"
          valueLabelDisplay="auto"
          value={typeof props.volume === "number" ? props.volume : 0}
          onChange={handleVolumeChange}
          sx={{
            width: "15vw",
            [theme.breakpoints.down("md")]: {
              width: "30vw",
            },
          }}
        />
        <VolumeUp onClick={handleVolumeMax} />
      </Stack>
    </Box>
  );
};
