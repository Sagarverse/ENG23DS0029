import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { NotificationsPage } from "./pages/NotificationsPage";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1565c0" },
    success: { main: "#2e7d32" },
    warning: { main: "#e65100" },
    background: { default: "#f5f5f5", paper: "#ffffff" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 10 } } },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsPage />
    </ThemeProvider>
  );
}