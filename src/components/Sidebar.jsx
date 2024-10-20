import React, { useState } from "react";
import styled from "styled-components";
import { MdHomeFilled } from "react-icons/md";
import { LuPartyPopper } from "react-icons/lu";
import Playlists from "./Playlists";
import CreatePlaylist from "./CreatePlaylist";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { RiCalendarScheduleLine } from "react-icons/ri";

export default function Sidebar() {
  const [, dispatch] = useStateProvider();
  const [showInput, setShowInput] = useState(false);

  const handleHomeClick = () => {
    // Dispatch to set selectedPlaylistId to the initial/default value
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" }); // Clear search term
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
          <RiCalendarScheduleLine />
            <span>Schedule</span>
          </li>
          <li>
            <LuPartyPopper />
            <span>Events</span>
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
