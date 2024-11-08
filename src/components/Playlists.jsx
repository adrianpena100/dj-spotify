import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { BsThreeDotsVertical } from "react-icons/bs"; // Ellipsis icon
import { MdOutlineDelete } from "react-icons/md"; // Delete icon
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";
import "../styles/Playlists.css"; // Import the CSS file

export default function Playlists() {
  const [{ token, playlists, updatePlaylists }, dispatch] = useStateProvider();
  const [selectedMenu, setSelectedMenu] = useState(null); // Track which menu is active
  const menuRef = useRef(null); // Ref to detect outside clicks

  useEffect(() => {
    const getPlaylistData = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const { items } = response.data;

      // Filter playlists containing "- PARTY"
      const filteredItems = items.filter(({ name }) =>
        name.includes("- PARTY")
      );

      // Map over the filtered playlists to include images
      const playlists = filteredItems.map(({ name, id, images }) => {
        const imageUrl =
          images && images.length > 0 && images[0].url
            ? images[0].url
            : "https://i.vinylcloud.io/404.svg";
        return {
          name,
          id,
          image: imageUrl,
        };
      });

      dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
    };
    getPlaylistData();
  }, [token, dispatch, updatePlaylists]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    // Reset selectedView to null to allow Body to render the selected playlist
    dispatch({ type: reducerCases.SET_SELECTED_VIEW, selectedView: null });

    // Set the new playlist ID to trigger fetching of the new playlist
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });

    // Clear search term to reset search and show playlist
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: "" });
  };

  const handleMenuToggle = (id) => {
    setSelectedMenu(selectedMenu === id ? null : id); // Toggle the menu for the selected playlist
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await axios.delete(`https://api.spotify.com/v1/playlists/${id}/followers`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      dispatch({ type: reducerCases.SET_UPDATE_PLAYLISTS }); // Refresh playlists after deletion
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  // Handle outside clicks to close the ellipsis menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setSelectedMenu(null); // Close the menu if clicked outside
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <div className="playlists-container">
      <ul>
        {playlists.map(({ name, id, image }) => {
          // Remove "- PARTY" from the displayed name
          const displayName = name.replace("- PARTY", "").trim();
          return (
            <li key={id}>
              <div className="playlist-item" onClick={() => changeCurrentPlaylist(id)}>
                <img
                  src={image}
                  alt="Playlist Art"
                  onError={(e) => {
                    e.target.src = "https://i.vinylcloud.io/404.svg";
                  }}
                />
                <span>{displayName}</span>
                <BsThreeDotsVertical
                  className="ellipsis"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuToggle(id);
                  }}
                />
                {selectedMenu === id && (
                  <div className="menu" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePlaylist(id);
                      }}
                    >
                      <MdOutlineDelete /> Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}