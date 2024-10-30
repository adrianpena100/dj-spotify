// src/App.jsx

import React, { useEffect } from "react";
import Login from "./components/Login";
import Spotify from "./components/Spotify";
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

  return <div>{token ? <Spotify /> : <Login />}</div>;
}
