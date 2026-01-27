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
      main: "#1a365d",
      light: "#3182ce",
      dark: "#0f2027",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3182ce",
      light: "#63b3ed",
      dark: "#2c5282",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f7fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a202c",
      secondary: "#4a5568",
    },
    grey: {
      50: "#f7fafc",
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
    success: {
      main: "#38a169",
      light: "#68d391",
      dark: "#2f855a",
    },
    warning: {
      main: "#dd6b20",
      light: "#f6ad55",
      dark: "#c05621",
    },
    error: {
      main: "#e53e3e",
      light: "#fc8181",
      dark: "#c53030",
    },
    info: {
      main: "#3182ce",
      light: "#63b3ed",
      dark: "#2c5282",
    },
  },
  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      fontSize: "3.5rem",
    },
    h2: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      fontSize: "2.25rem",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.875rem",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
      letterSpacing: "0.025em",
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 400,
    },
    overline: {
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f7fafc",
          scrollBehavior: "smooth",
        },
        "*": {
          boxSizing: "border-box",
        },
        "::-webkit-scrollbar": {
          width: "8px",
        },
        "::-webkit-scrollbar-track": {
          background: "#edf2f7",
        },
        "::-webkit-scrollbar-thumb": {
          background: "#cbd5e0",
          borderRadius: "4px",
        },
        "::-webkit-scrollbar-thumb:hover": {
          background: "#a0aec0",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#f7fafc",
            transition: "all 0.3s ease",
            fontSize: "1rem",
            "& fieldset": {
              borderColor: "#e2e8f0",
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3182ce",
              borderWidth: 2,
            },
            "&:hover": {
              backgroundColor: "#ffffff",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#4a5568",
            fontWeight: 500,
            "&.Mui-focused": {
              color: "#3182ce",
            },
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#f7fafc",
            transition: "all 0.3s ease",
            "& fieldset": {
              borderColor: "#e2e8f0",
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3182ce",
              borderWidth: 2,
            },
            "&:hover": {
              backgroundColor: "#ffffff",
            },
            "&.Mui-focused": {
              backgroundColor: "#ffffff",
            },
          },
        },
        paper: {
          borderRadius: 12,
          boxShadow:
            "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        },
        option: {
          borderRadius: 6,
          margin: "4px 8px",
          fontSize: "0.875rem",
          '&[data-focus="true"]': {
            backgroundColor: "#ebf8ff",
          },
          '&[aria-selected="true"]': {
            backgroundColor: "#3182ce",
            color: "#ffffff",
            '&[data-focus="true"]': {
              backgroundColor: "#2c5282",
            },
          },
        },
        listbox: {
          padding: 8,
        },
        noOptions: {
          fontSize: "0.875rem",
          color: "#718096",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          textTransform: "none",
          padding: "0.75rem 1.5rem",
          fontSize: "0.875rem",
          transition: "all 0.3s ease",
        },
        contained: {
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
            transform: "translateY(-1px)",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
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