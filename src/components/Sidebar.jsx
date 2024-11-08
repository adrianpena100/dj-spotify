import React, { useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineOrderedList } from "react-icons/ai"; // Icon for Queue
import Playlists from "./Playlists";
import CreatePlaylist from "./CreatePlaylist";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import '../styles/Sidebar.css'; // Import the CSS file

export default function Sidebar() {
  const [, dispatch] = useStateProvider();
  const [showInput, setShowInput] = useState(false);

  const handleHomeClick = () => {
    dispatch({
      type: reducerCases.SET_PLAYLIST_ID,
      selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M", // Your default playlist ID
    });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" }); // Clear search term
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: null }); // Reset the view
  };

  const handleSchedulerClick = () => {
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: "SCHEDULER" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" }); // Clear search term
    // Optionally reset the selected playlist
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
    // Dispatch an action to reset the scheduler state
    dispatch({ type: reducerCases.RESET_SCHEDULER });
  };

  const handleQueueClick = () => {
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: "QUEUE" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" }); // Clear search term
    // Optionally reset the selected playlist
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
  };

  return (
    <div className="sidebar-container">
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
    </div>
  );
}