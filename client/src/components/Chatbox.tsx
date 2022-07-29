import React, { useEffect, useRef } from "react";
import { IChatboxProps } from "../Interfaces";
import { useTheme } from "@mui/material/styles";

// material UI
import {
  Box,
  List,
  ListItem,
  TextField,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Grow,
  Slide,
  Autocomplete,
} from "@mui/material";
import { gameBoardLight } from "../styles/theme";

// assets
import logo from "../assets/r_logo.png";

const Chatbox = (props: IChatboxProps) => {
  const theme = useTheme();

  const [value, setValue] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState<string>("");

  const containerRef: React.MutableRefObject<null> = useRef(null);
  const bgc: string =
    props.gameboardTheme === gameBoardLight ? "#FFFFFF" : "#121212";

  // displays all chat messages
  const chat = props.messages.map((m, i) => {
    return (
      <Slide
        key={i}
        direction="left"
        in={true}
        container={containerRef.current}
      >
        <ListItem key={i}>
          <ListItemAvatar>
            <Avatar
              src={m.avatar ? m.avatar : logo}
              sx={{ padding: 1, width: 40, height: 40 }}
            />
          </ListItemAvatar>
          {m.username ? (
            <ListItemText primary={m.username} secondary={m.message} />
          ) : (
            <ListItemText primary={m.message} />
          )}
        </ListItem>
      </Slide>
    );
  });

  useEffect(() => {
    let message = inputValue;
    if (inputValue.includes("by:")) {
      message = message.slice(0, message.indexOf(" by:"));
    }
    props.setMessage(message);
  }, [inputValue]);

  useEffect(() => {
    setInputValue(props.message);
  }, [props.mode]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    props.sendMessage(e);
    // clear text boxes after sending
    props.setMessage("");
    setInputValue("");
  };

  return (
    <Grow in={true} {...{ timeout: 1000 }}>
      <Box
        sx={{
          display: "flex",
          borderRadius: 2,
          backgroundColor: bgc,
          margin: 1,
          padding: 2,
          height: "90vh",
          [theme.breakpoints.down("md")]: {
            height: "28vh",
          },
          flexDirection: "column-reverse",
          boxShadow: 5,
        }}
      >
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {props.mode !== "ROUND" && (
            <TextField
              margin="normal"
              fullWidth
              id="message"
              name="message"
              autoComplete="off"
              type="text"
              placeholder="Your Guess"
              value={props.message}
              onChange={(e) => props.setMessage(e.target.value)}
              autoFocus
            />
          )}
          {props.mode === "ROUND" && (
            <Autocomplete
              fullWidth
              id="autocomplete-songlist"
              freeSolo
              value={value}
              onChange={(e: any, newValue) => setValue(newValue)}
              inputValue={inputValue}
              onInputChange={(e: any, newInputValue) =>
                setInputValue(newInputValue)
              }
              options={props.tracklist.map(
                (track) => `${track.name} by: ${track.artist}`
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="normal"
                  name="message"
                  type="text"
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                />
              )}
              ListboxProps={{
                style: {
                  maxHeight: "10vh",
                  flexWrap: "nowrap",
                  overflowX: "hidden",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                },
              }}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          <List id={"chatbox"}>{chat}</List>
        </Box>
      </Box>
    </Grow>
  );
};

export default Chatbox;
