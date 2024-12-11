import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
import TimeChecker from "./components/TimeChecker";
import HostMessages from "./components/HostMessages";
import GuestEntry from "./components/GuestEntry";
import Queue from "./components/Queue";
import Scheduler from "./components/Scheduler";
import Layout from "./components/Layout";
import Callback from "./components/Callback";
import { reducerCases } from "./utils/Constants";
import { useStateProvider } from "./utils/StateProvider";

export default function App() {
  const [{ token }, dispatch] = useStateProvider();

  useEffect(() => {
    const storedToken = window.localStorage.getItem('spotify_token'); // Retrieve token from localStorage
    if (storedToken) {
      dispatch({ type: reducerCases.SET_TOKEN, token: storedToken });
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
            <Route path="queue" element={<Queue />} />
            <Route path="scheduler" element={<Scheduler />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        ) : (
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
}
