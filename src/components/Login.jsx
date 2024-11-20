import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

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

  const handleGuestClick = () => {
    navigate("/guest-room-code");
  };

  return (
    <Container>
      <Logo
        src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_White.png"
        alt="spotify"
      />
      <Title>Spotify Live DJ</Title>
      <ButtonGroup>
      <SpotifyButton onClick={handleClick}>Login With Spotify</SpotifyButton>
      <GuestButton onClick={handleGuestClick}>Continue as Guest</GuestButton>
      </ButtonGroup>
    </Container>
  );

}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #121212; /* Spotify's dark grey */
  gap: 2rem; /* Reduced gap for better spacing */
`;

const Logo = styled.img`
  height: 15vh;
`;

const Title = styled.div`
  font-size: 2rem;
  color: white;
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between buttons */

  /* Remove fixed width to allow buttons to size based on content */
  /* Alternatively, set a min-width instead of fixed width */
  /* button {
    width: 250px; 
  } */
`;

/* SpotifyButton styled component */
const SpotifyButton = styled.button`
  padding: 0.75rem 2.5rem; /* Adjusted padding */
  border-radius: 3rem;
  background-color: #1db954; /* Spotify Green */
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
  text-align: center; /* Ensure text is centered */

  &:hover {
    background-color: #1ed760; /* Lighter green on hover */
  }
  
  @media (max-width: 600px) {
    padding: 0.5rem 2rem;
    font-size: 1rem;
  }
`;

/* GuestButton styled component */
const GuestButton = styled.button`
  padding: 0.75rem 2.5rem; /* Adjusted padding */
  border-radius: 3rem;
  background-color: #6c757d; /* Grey background */
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap; /* Prevent text wrapping */
  text-align: center; /* Ensure text is centered */

  &:hover {
    background-color: #5a6268; /* Darker grey on hover */
  }
  @media (max-width: 600px) {
    padding: 0.5rem 2rem;
    font-size: 1rem;
  }
`;