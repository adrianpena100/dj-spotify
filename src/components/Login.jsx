import React, { useState } from "react";
import "../styles/Login.css";

export default function Login() {
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestMessage, setGuestMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [createdSessionId, setCreatedSessionId] = useState(null);

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

  const createSession = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/session', {
        method: 'POST',
      });
      const data = await response.json();
      setCreatedSessionId(data.sessionId);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleGuestSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: guestMessage }),
      });
      if (response.ok) {
        setGuestMessage("");
        setShowGuestForm(false);
      } else {
        console.error('Failed to submit message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    }
  };

  return (
    <div className="LgContainer">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="spotify"
      />
      <div>Spotify Live DJ</div>
      <button onClick={handleClick}>Login With Spotify</button>
      <button onClick={createSession}>Create Session</button>
      {createdSessionId && <div>Session ID: {createdSessionId}</div>}
      <button onClick={() => setShowGuestForm(!showGuestForm)}>Guest Input</button>
      {showGuestForm && (
        <div className="guest-form">
          <input
            type="text"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Enter Session ID"
          />
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