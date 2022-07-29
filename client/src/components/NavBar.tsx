import React, { useState } from "react";
import { INavProps } from "../Interfaces";

import logo from "../assets/remi_yellow.png";

import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Modal,
  Box,
  Link,
  Divider,
  useTheme,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { lightTheme } from "../styles/theme";

const NavBar = (props: INavProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => setOpen(false);
  const handleTheme = (): void => props.changeTheme();

  const theme = useTheme();

  return (
    <AppBar position="static">
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: '42px'
        }}
      >
        <Toolbar>
          <img
            src={logo}
            style={{height: '40px', marginTop: '12px', cursor: 'pointer'}}
            onClick={() => {
              location.reload();
            }}
            alt="remi logo"
          />
        </Toolbar>
        <Typography
          component="a"
          sx={{ display: "flex", color: "inherit", alignItems: "center" }}
        >
          <InfoIcon onClick={handleOpen}/>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 500,
                bgcolor: '#fff',
                border: 3,
                boxShadow: 24,
                p: 4,
                [theme.breakpoints.down("md")]: {
                  width: "75vw",
                },
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mr: 2,
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  textDecoration: "none",
                  marginBottom: 1,
                }}
              >
                Remi
              </Typography>
              <Typography variant="subtitle1" gutterBottom component="div">
                Music Trivia Game.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Instructions:</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                1. Upon selecting a genre and # of rounds, a series of songs
                will be prepared for you to guess.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                2. Each round a <strong>30 second clip</strong> of a song will
                play.
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                3. If you know the song, type the <strong>song title</strong>{" "}
                into the guess box and hit enter.
              </Typography>

              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <strong>Scoring:</strong>
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                ⏳ You will receive points based on how quickly you can guess
                the songs!
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                🌟 If you can't guess a song, don't stress, you will have more opportunities.
              </Typography>
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, marginBottom: 2 }}
              >
                🏆 The winner gets bragging rights!
              </Typography>

              <Divider />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LinkedInIcon sx={{ marginRight: 1 }} />
                  <Link
                    href="https://www.linkedin.com/in/cesar-santamaria-23082a1ba/"
                    underline="none"
                  >
                    Cesar Santamaria
                  </Link>
                </Box>
              </Box>
            </Box>
          </Modal>
        </Typography>
      </Container>
    </AppBar>
  );
};

export default NavBar;
