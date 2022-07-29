import React from "react";
import { ILoadingProps, ISocket } from "./Interfaces";

import "./styles/loading.css";
import { Typography, Box } from "@mui/material";

const Loading = (props: ILoadingProps) => {
  const socket: ISocket = props.socket;

    socket.on("joined-room", (data: string) =>{
      props.setStatus("success")
      console.log("Socket received success")
    })
    socket.on("room-full", (data: string) =>{
      props.setStatus("full")
      console.log("Socket received full")
    })

  return (
    <>
      <Typography variant="h1" color="white">Loading</Typography>
      <Box sx={{ marginBottom: 4 }}>
        <div className="load">
          <div className="load-one"></div>
          <div className="load-two"></div>
          <div className="load-three"></div>
        </div>
      </Box>
    </>
  );
};

export default Loading;
