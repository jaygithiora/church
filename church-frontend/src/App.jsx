import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext";
import InactivityHandler from "./services/dashboard/InactivityHandler";
import AppRoutes from "./AppRoute";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import { SnackbarProvider } from "notistack";


const libraries = ['places', 'geometry'];
const GOOGLE_MAPS_API_KEY = 'AIzaSyDo1hOFvVE-CaBbJE1o-WFBmByKdLB8uF0'; // replace with your real key

function App() {
  const theme = createTheme({
    typography: {
      fontFamily: `'Outfit', 'Helvetica', 'Arial', sans-serif`,
    },
  });
  return (
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
    </ThemeProvider>
  );
}

export default App;
