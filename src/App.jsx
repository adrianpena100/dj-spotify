// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import TimeChecker from "./components/TimeChecker";
import HostMessages from "./components/HostMessages";
import GuestEntry from "./components/GuestEntry";
import Layout from "./components/Layout";
import Callback from "./components/Callback"; // You'll create this component
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";

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
        {/* Public Routes */}
        <Route path="/guest-entry" element={<GuestEntry />} />
        <Route path="/callback" element={<Callback />} />

        {/* Protected Routes */}
        {token ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<Spotify />} />
            <Route path="time-checker" element={<TimeChecker />} />
            <Route path="host-messages" element={<HostMessages />} />
            {/* Add more protected routes here */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          // Redirect all other routes to Login if not authenticated
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
}
