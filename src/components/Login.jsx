import React, { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestMessage, setGuestMessage] = useState("");

  const handleClick = async () => {
    const client_id = "69fd466f76c84dc9b965ac235c3c97b7";
    const redirect_uri = "http://localhost:3000/callback";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
      "streaming",
      "playlist-modify-public",
      "playlist-modify-private"
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };

  const handleGuestSubmit = () => {
    // Save the guest message to localStorage or send it to a backend
    const messages = JSON.parse(localStorage.getItem("guestMessages")) || [];
    messages.push(guestMessage);
    localStorage.setItem("guestMessages", JSON.stringify(messages));
    setGuestMessage("");
    setShowGuestForm(false);
  };

  return (
    <div className="LgContainer">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="spotify"
      />
      <div>Spotify Live DJ</div>
      <button onClick={handleClick}>Login With Spotify</button>
      <button onClick={() => setShowGuestForm(!showGuestForm)}>Guest Input</button>
      {showGuestForm && (
        <div className="guest-form">
          <textarea
            value={guestMessage}
            onChange={(e) => setGuestMessage(e.target.value)}
            placeholder="Enter your message"
          />
          <button onClick={handleGuestSubmit}>Submit</button>
        </div>
      )}
    </div>
  );
}