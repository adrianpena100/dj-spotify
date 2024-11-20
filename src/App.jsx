// src/App.jsx
import React, { useEffect } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import TimeChecker from "./components/TimeChecker";
import GuestRoomCode from "./components/GuestRoomCode"; // Ensure you have this component
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Added Navigate

export default function App() {
  const [{ token }, dispatch] = useStateProvider();

  useEffect(() => {
    const hash = window.location.hash;
    let tokenFromHash = null;
    if (hash) {
      tokenFromHash = hash.substring(1).split("&")[0].split("=")[1];
      if (tokenFromHash) {
        dispatch({ type: reducerCases.SET_TOKEN, token: tokenFromHash });
      }
    }
    document.title = "Spotify Scheduler";
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Guest Route */}
        <Route path="/guest-room-code" element={<GuestRoomCode />} />

        {/* Protected Routes */}
        {token ? (
          <>
            <Route path="/spotify" element={<Spotify />} />
            <Route path="/time-checker" element={<TimeChecker />} />
            {/* Add other protected routes here */}
          </>
        ) : (
          /* Public Routes */
          <Route path="/login" element={<Login />} />
        )}

        {/* Default Route Handling */}
        <Route
          path="*"
          element={
            token ? (
              <Navigate to="/spotify" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}
