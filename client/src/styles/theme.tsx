import { ITheme } from "../Interfaces";
import { createTheme } from "@mui/material";

export const navTheme: ITheme = createTheme({
  palette: {
    primary: {
      main: "#5400c5", // Purple #5400c5; yellow = #f1c412
    },
  },
});

export const lightTheme: ITheme = createTheme({
  palette: {
    primary: {
      main: "#f1c412",
    },
    secondary: {
      main: "#11AD94",
    },
  },
});

export const gameBoardLight: ITheme = createTheme({
  palette: {
    primary: {
      main: "#f1c412",
    },
    secondary: {
      main: "#3EA4B4",
    },
    background: {
      default: "#F4F4FF",
    },
  },
});

export const darkTheme: ITheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5400c5",
    },
    secondary: {
      main: "#3EA4B4",
    },
  },
});

export const gameBoardDark: ITheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#11AD94",
    },
    secondary: {
      main: "#3EA4B4",
    },
    background: {
      default: "#3F3F3F",
    },
  },
});

export const gameModeDark: ITheme = createTheme({
  palette: {
    background: {
      default: "#121212",
    },
  },
});
