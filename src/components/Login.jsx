// Login.jsx
import React from "react";
import "../styles/Login.css";  // Import the new CSS file

export default function Login() {
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

  return (
    <div className="login-container">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="spotify"
      />
      <div>Spotify Live DJ</div>
      <button onClick={handleClick}>Login With Spotify</button>
    </div>
  );
}