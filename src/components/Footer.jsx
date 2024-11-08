// Footer.jsx
import React from "react";
import CurrentTrack from "./CurrentTrack";
import PlayerControls from "./PlayerControls";
import Volume from "./Volume";
import "../styles/Footer.css";  // Import the new CSS file

export default function Footer() {
  return (
    <div className="footer-container">
      <CurrentTrack />
      <PlayerControls />
      <Volume />
    </div>
  );
}