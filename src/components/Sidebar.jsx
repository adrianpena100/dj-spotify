// src/components/Sidebar.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { MdHomeFilled } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineOrderedList } from "react-icons/ai"; // Icon for Queue
import Playlists from "./Playlists";
import CreatePlaylist from "./CreatePlaylist";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function Sidebar() {
  const [, dispatch] = useStateProvider();
  const [showInput, setShowInput] = useState(false);

  const handleHomeClick = () => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" }); // Clear search term
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: null }); // Reset the view
  };

  const handleSchedulerClick = () => {
    dispatch({
      type: reducerCases.SET_SELECTED_VIEW,
      selectedView: "SCHEDULER",
    });
    // Dispatch an action to reset the scheduler state
    dispatch({ type: reducerCases.RESET_SCHEDULER });
  };

  const handleQueueClick = () => {
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: "QUEUE" });
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
          <li onClick={handleSchedulerClick}>
            <RiCalendarScheduleLine />
            <span>Schedule</span>
          </li>
          <li onClick={handleQueueClick}>
            <AiOutlineOrderedList />
            <span>Queue</span>
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
      }
    }
  }
`;
