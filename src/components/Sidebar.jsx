// Sidebar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import Playlists from "./Playlists";
import CreatePlaylist from "./CreatePlaylist";
import { useStateProvider } from "../utils/StateProvider"; // Import state provider
import { reducerCases } from "../utils/Constants"; // Import reducer cases

export default function Sidebar() {
  const [, dispatch] = useStateProvider(); // Only destructure dispatch, no need for selectedPlaylistId
  const [showInput, setShowInput] = useState(false); // Manage show input state here

  const handleHomeClick = () => {
    // Dispatch action to set selectedPlaylistId to the initial/default value
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M" });
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
          <li onClick={handleHomeClick}>
            <MdHomeFilled />
            <span>Home</span>
          </li>
          <li>
            <MdSearch />
            <span>Search</span>
          </li>
          <li>
            <LuPartyPopper />
            <span>Schedule</span>
          </li>
          <li>
            <CreatePlaylist showInput={showInput} setShowInput={setShowInput} />
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
