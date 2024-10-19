// Sidebar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { MdHomeFilled, MdSearch, MdAdd } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";
import Playlists from "./Playlists";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function Sidebar() {
  const [{ token }, dispatch] = useStateProvider();
  const [showInput, setShowInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const createPlaylist = async () => {
    if (newPlaylistName.trim() !== "") {
      const playlistName = newPlaylistName + " - PARTY";
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/playlists`,
          {
            name: playlistName,
            description: "", // Set description to an empty string
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        // Reset the input
        setNewPlaylistName("");
        setShowInput(false);

        // Fetch playlists again to update the sidebar
        dispatch({ type: reducerCases.SET_UPDATE_PLAYLISTS });
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createPlaylist();
    }
  };

  return (
    <Container>
      <div className="top__links">
        <div className="logo">
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
            alt="spotify"
          />
        </div>
        <ul>
          <li>
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li>
            <MdSearch />
            <span>Search</span>
          </li>
          <li>
            <IoLibrary />
            <span>Your Playlists</span>
          </li>
          <li>
            <MdAdd />
            {showInput ? (
              <input
                type="text"
                placeholder="New Playlist Name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            ) : (
              <span onClick={() => setShowInput(true)}>Create Playlist</span>
            )}
          </li>
        </ul>
      </div>
      <Playlists />
    </Container>
  );
}

const Container = styled.div`
  background-color: black;
  color: #b3b3b3;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  .top__links {
    display: flex;
    flex-direction: column;
    .logo {
      text-align: center;
      margin: 1rem 0;
      img {
        max-inline-size: 80%;
        block-size: auto;
      }
    }
    ul {
      list-style-type: none;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      li {
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: white;
        }
        input {
          flex: 1;
          padding: 0.5rem;
          background-color: #333;
          border: none;
          border-radius: 4px;
          color: white;
        }
      }
    }
  }
`;
