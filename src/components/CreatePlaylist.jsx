// CreatePlaylist.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdAdd } from "react-icons/md"; // Import the MdAdd icon
import styled from "styled-components"; // Import styled-components
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function CreatePlaylist({ showInput, setShowInput }) {
  const [{ token }, dispatch] = useStateProvider();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const inputRef = useRef(null);

  const createPlaylist = async () => {
    if (newPlaylistName.trim() !== "") {
      const playlistName = newPlaylistName + " - PARTY";
      try {
        const response = await axios.post(
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

        const newPlaylist = response.data;

        // Reset the input
        setNewPlaylistName("");
        setShowInput(false);

        // Dispatch the new playlist to the state
        dispatch({ type: reducerCases.ADD_PLAYLIST, newPlaylist });

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

  // Close the input if clicking outside
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
  }, [setShowInput]); // Include setShowInput in the dependency array

  return (
    <>
      {showInput ? (
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder="Enter playlist name..."
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <StyledButton onClick={() => setShowInput(true)}>
          Create Party Playlist <MdAdd style={{ fontSize: "1.1rem", fontWeight: "bold" }} /> {/* Add MdAdd icon here */}
        </StyledButton>
      )}
    </>
  );
}

// Styled components for a prettier input form
const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  height: 20px;  // Set a fixed height to match the button
  background-color: #2c2c2c;
  color: #fff;
  border: none;
  border-radius: 15px;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    background-color: #3c3c3c;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
  }

  &::placeholder {
    color: #bbb;
  }
`;

const StyledButton = styled.span`
  background-color: #1db954;
  padding: 0.5rem 0.75rem;
  height: 20px;  // Set a fixed height to match the input field
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  border-radius: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #1aa34a;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }
`;