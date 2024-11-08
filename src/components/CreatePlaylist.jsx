// CreatePlaylist.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdAdd } from "react-icons/md";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import "../styles/CreatePlaylist.css";

export default function CreatePlaylist({ showInput, setShowInput }) {
  const [{ token }, dispatch] = useStateProvider();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const inputRef = useRef(null);

  const createPlaylist = async () => {
    if (newPlaylistName.trim() !== "") {
      const playlistName = newPlaylistName + " - PARTY";
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/playlists`,
          {
            name: playlistName,
            description: "Party Playlist",
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        setNewPlaylistName("");
        setShowInput(false);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowInput]);

  return (
    <>
      {showInput ? (
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter playlist name..."
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="styled-input"
        />
      ) : (
        <span onClick={() => setShowInput(true)} className="styled-button">
          Create Party Playlist <MdAdd style={{ fontSize: "1.1rem", fontWeight: "bold" }} />
        </span>
      )}
    </>
  );
}