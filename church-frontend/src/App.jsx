import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import InactivityHandler from "./services/dashboard/InactivityHandler";
import AppRoutes from "./AppRoute";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import { SnackbarProvider } from "notistack";
import { getTheme } from "./theme";
import { useMediaQuery } from "@mui/material";
import { ThemeModeContext } from "./services/ThemeContext";


const libraries = ['places', 'geometry'];
const GOOGLE_MAPS_API_KEY = 'AIzaSyC6tnqUwkHrI6AWEP3FJlD6EFNKvjctOms'; // replace with your real key

function App() {

  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || (prefersDark ? "dark" : "light")
  );
  //const [mode, setMode] = useState(prefersDark ? "dark" : "light");

  const theme = useMemo(() => getTheme(mode), [mode]);
  {/*
    <ThemeProvider theme={theme}>
      <CssBaseline /> 
      <MainLayout toggleTheme={() =>
        setMode((prev) => (prev === "light" ? "dark" : "light"))
      } />
    </ThemeProvider>*/}
  return (
    <ThemeModeContext.Provider value={{
      toggleTheme: () => {
        //setMode((prev) => (prev === "light" ? "dark" : "light"));
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("theme", next);
          return next;
        });
      }
    }}>
      <ThemeProvider theme={theme}>
        <CssBaseline /> {/* optional: resets browser styles */}
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
          <SnackbarProvider maxSnack={5} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <AuthProvider>
              <ToastContainer />
              <Router>
                <InactivityHandler />
                <AppRoutes />
              </Router>
            </AuthProvider>
          </SnackbarProvider>
        </LoadScript>
      </ThemeProvider></ThemeModeContext.Provider>
  );
}

export default App;
