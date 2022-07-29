import React from "react";
import { Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minWidth: "100vw",
        marginTop: 0.5,
        color: 'black'
      }}
    >
      <Typography variant="subtitle1">
        {" "}
        © 2022 Remi, All Rights Reserved
      </Typography>
    </Container>
  );
};

export default Footer;
