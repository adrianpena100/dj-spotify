// src/components/SearchSong.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillClockCircle } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import "../styles/SearchSong.css";

export default function SearchSong({ searchTerm }) {
  const [{ token, deviceId }, dispatch] = useStateProvider();
  const [searchResults, setSearchResults] = useState([]);
  const [partyPlaylists, setPartyPlaylists] = useState([]);
  const [selectedSongUri, setSelectedSongUri] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (searchTerm) {
      const searchForSongs = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              searchTerm
            )}&type=track`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          const tracks = response.data.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name).join(", "),
            album: track.album.name,
            image:
              track.album.images[2]?.url || "https://i.vinylcloud.io/404.svg",
            duration: track.duration_ms,
            uri: track.uri,
          }));

          setSearchResults(tracks);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      searchForSongs();
    } else {
      setSearchResults([]); // Clear results if no search term
    }
  }, [searchTerm, token]);

  // Fetch playlists when component mounts
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const allPlaylists = response.data.items;

        // Filter and format playlists containing '- PARTY' in their name
        const formattedPlaylists = allPlaylists
          .filter((playlist) => playlist.name.includes("- PARTY"))
          .map((playlist) => ({
            ...playlist,
            formattedName: playlist.name.replace("- PARTY", "").trim(),
          }));

        setPartyPlaylists(formattedPlaylists);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    if (token) {
      fetchPlaylists();
    }
  }, [token]);

  const playTrack = async (id, name, artists, image, uri) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          uris: [uri],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const currentPlaying = {
        id,
        name,
        artists: artists.split(", "),
        image,
      };
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
    } catch (error) {
      console.error("Error playing the track:", error);
    }
  };

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  // Handle adding the selected song to a playlist
  const handleAddToPlaylist = async (playlist) => {
    const { id: playlistId, formattedName } = playlist;
    if (token && selectedSongUri) {
      try {
        await axios.post(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            uris: [selectedSongUri],
          },
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );

        // Set the notification in global state
        dispatch({
          type: reducerCases.SET_NOTIFICATION,
          notification: `Added to ${formattedName}`,
        });

        // Dispatch action to update playlists
        dispatch({
          type: reducerCases.SET_UPDATE_PLAYLISTS,
          updatePlaylists: true,
        });
      } catch (error) {
        console.error("Error adding song to playlist:", error);
        dispatch({
          type: reducerCases.SET_NOTIFICATION,
          notification: "Failed to add song to playlist.",
        });
      } finally {
        setShowDropdown(false);
        setSelectedSongUri(null);
      }
    }
  };

  // Handle clicking the plus icon for a track
  const handlePlusClick = (e, songUri) => {
    e.stopPropagation(); // Prevent triggering playTrack
    setSelectedSongUri(songUri);
    setShowDropdown(true);

    // Get the position of the plus icon to position the dropdown
    const rect = e.target.getBoundingClientRect();
    setDropdownPosition({ x: rect.left, y: rect.bottom });
  };

  return (
    <>
      <div className="list">
        <div className="header-row">
          <div className="col">
            <span>#</span>
          </div>
          <div className="col">
            <span>TITLE</span>
          </div>
          <div className="col">
            <span>ALBUM</span>
          </div>
          <div className="col">
            <span>
              <AiFillClockCircle />
            </span>
          </div>
          <div className="col">
            {/* Add the plus icon in the header as a placeholder */}
            <span>
              <FaPlus style={{ visibility: "hidden" }} />
            </span>
          </div>
        </div>
        <div className="tracks">
          {searchResults.length > 0 ? (
            searchResults.map((track, index) => (
              <div
                className="row"
                key={track.id}
                onClick={() =>
                  playTrack(
                    track.id,
                    track.name,
                    track.artists,
                    track.image,
                    track.uri
                  )
                }
              >
                <div className="col">
                  <span>{index + 1}</span>
                </div>
                <div className="col detail">
                  <div className="image">
                    <img src={track.image} alt="track" />
                  </div>
                  <div className="info">
                    <span className="name">{track.name}</span>
                    <span>{track.artists}</span>
                  </div>
                </div>
                <div className="col">
                  <span>{track.album}</span>
                </div>
                <div className="col">
                  <span>{msToMinutesAndSeconds(track.duration)}</span>
                </div>
                <div className="col">
                  {/* Add a plus icon for each track to add to playlist */}
                  <span
                    onClick={(e) => handlePlusClick(e, track.uri)}
                    style={{ cursor: "pointer", color: "#1db954", marginLeft: "15px"}}
                  >
                    <FaPlus />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <span>No results found</span>
            </div>
          )}
        </div>
      </div>
      {/* Dropdown menu */}
      {showDropdown && (
        <div
          className="dropdown"
          style={{
            position: "fixed",
            top: dropdownPosition.y + 10,
            left: dropdownPosition.x - 55,
            backgroundColor: "#282828",
            padding: "1rem",
            borderRadius: "8px",
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {partyPlaylists.map((playlist) => (
              <li
                key={playlist.id}
                onClick={() => handleAddToPlaylist(playlist)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#444"; // Highlight color
                  e.currentTarget.style.paddingLeft = "1rem"; // Adjust left padding
                  e.currentTarget.style.paddingRight = "1rem"; // Adjust right padding
                  e.currentTarget.style.borderRadius = "8px"; // Rounded corners
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.paddingLeft = "0.5rem"; // Reset padding
                  e.currentTarget.style.paddingRight = "0.5rem"; // Reset padding
                  e.currentTarget.style.borderRadius = "0"; // Reset border radius
                }}
                style={{
                  padding: "0.5rem 0.5rem", // Initial padding for top/bottom and left/right
                  cursor: "pointer",
                  color: "#fff",
                  transition: "background-color 0.3s, padding 0.3s, border-radius 0.3s", // Smooth transition effect
                }}
              >
                {playlist.formattedName}
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShowDropdown(false)}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "transparent",
              color: "#fff",
              border: "1px solid #fff",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
