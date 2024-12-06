// src/components/Sidebar.jsx
import React, { useState } from "react";
import { MdHomeFilled } from "react-icons/md";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { AiOutlineOrderedList, AiOutlineMail } from "react-icons/ai"; 
import Playlists from "./Playlists";
import CreatePlaylist from "./CreatePlaylist";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import "../styles/Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [, dispatch] = useStateProvider();
  const [showInput, setShowInput] = useState(false);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
    dispatch({
      type: reducerCases.SET_PLAYLIST_ID,
      selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M",
    });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" });
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: null });
  };

  const handleSchedulerClick = () => {
    navigate("/scheduler");
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: "SCHEDULER" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" });
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
    dispatch({ type: reducerCases.RESET_SCHEDULER });
  };

  const handleQueueClick = () => {
    navigate("/queue");
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: "QUEUE" });
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" });
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId: null });
  };

  const handleMessagesClick = () => {
    navigate("/host-messages");
  };

  return (
    <div className="SContainer">
      <div className="logo-container">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
          alt="Spotify"
          className="spotify-logo"
        />
      </div>
      <div className="top__links">
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
          <li onClick={handleMessagesClick}>
            <AiOutlineMail />
            <span>Requests</span>
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


// const Container = styled.div`
//   background-color: black;
//   color: #b3b3b3;
//   display: flex;
//   flex-direction: column;
//   height: 100%;
//   width: 100%;
//   .top__links {
//     display: flex;
//     flex-direction: column;
//     .logo {
//       text-align: center;
//       margin: 1rem 0;
//       img {
//         max-inline-size: 80%;
//         block-size: auto;
//       }
//     }
//     ul {
//       list-style-type: none;
//       display: flex;
//       flex-direction: column;
//       gap: 1rem;
//       padding: 1rem;
//       li {
//         display: flex;
//         align-items: center;
//         gap: 1rem;
//         cursor: pointer;
//         transition: 0.3s ease-in-out;
//         &:hover {
//           color: white;
//         }
//       }
//     }
//   }
// `;
