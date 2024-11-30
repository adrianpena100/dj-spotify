import React from "react";
// import styled from "styled-components";
import "../styles/Login.css";

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
      "streaming", // Add this line
      "playlist-modify-public",
      "playlist-modify-private"
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };
  return (
    <div className="LgContainer">
      <img
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="spotify"
      />
      <div>Spotify Live DJ</div>
      <button onClick={handleClick}>Login With Spotify</button>
    </div>
  );
}

// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   flex-direction: column;
//   height: 100vh;
//   width: 100vw;
//   background-color: #121212; /* Changed to Spotify's dark grey */
//   gap: 5rem;

//   img {
//     height: 15vh; /* Adjusted the image size to be smaller */
//   }

//   div {
//     font-size: 2rem; /* Adjust as needed */
//     color: white; /* Set the font color to white */
//     font-weight: bold;
//   }

//   button {
//     padding: 0.75rem 3rem; /* Reduced the size of the button */
//     border-radius: 3rem;
//     background-color: #1db954;
//     color: white;
//     border: none;
//     font-size: 1.2rem; /* Reduced the font size */
//     cursor: pointer;
//   }
// `;