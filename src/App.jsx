// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import GuestRoomCode from "./components/GuestRoomCode";
import TimeChecker from "./components/TimeChecker";
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";

function Callback() {
  const navigate = useNavigate();
  const [, dispatch] = useStateProvider();

  useEffect(() => {
    const hash = window.location.hash;
    let tokenFromHash = null;
    if (hash) {
      tokenFromHash = hash.substring(1).split("&")[0].split("=")[1];
      if (tokenFromHash) {
        dispatch({ type: reducerCases.SET_TOKEN, token: tokenFromHash });
        navigate("/spotify"); // Redirect to Spotify component
      }
    }
    window.location.hash = ""; // Clear the hash after extraction
  }, [dispatch, navigate]);

  return <div>Authenticating...</div>; // Optional loading message during redirect
}

export default function App() {
  const [{ token }] = useStateProvider();

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Guest Area */}
        <Route path="/guest-room-code" element={<GuestRoomCode />} />

        {/* Callback for Spotify Authentication */}
        <Route path="/callback" element={<Callback />} />

        {/* Protected Routes */}
        <Route
          path="/spotify"
          element={
            token ? (
              <>
                <Spotify />
                <TimeChecker />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Default Route */}
        <Route
          path="*"
          element={
            token ? <Navigate to="/spotify" replace /> : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </Router>
  );
}
