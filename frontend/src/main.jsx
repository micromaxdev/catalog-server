import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0C75BC",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0C75BC",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0C75BC",
          },
        },
        option: {
          '&[data-focus="true"]': {
            backgroundColor: "#f0f0f0",
          },
          '&[aria-selected="true"]': {
            backgroundColor: "#e0e0e0",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
