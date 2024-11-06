// src/components/Scheduler.jsx
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { IoArrowBack } from "react-icons/io5"; // Import the back arrow icon

export default function Scheduler() {
  const [{ token, playlists, resetScheduler }, dispatch] = useStateProvider();
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [errorLoadingTracks, setErrorLoadingTracks] = useState(null);

  // Handle resetting the scheduler when the resetScheduler flag is set
  useEffect(() => {
    if (resetScheduler) {
      setSelectedPlaylist(null);
      setPlaylistTracks([]);
      dispatch({ type: reducerCases.CLEAR_RESET_SCHEDULER });
    }
  }, [resetScheduler, dispatch]);

  // Fetch playlist tracks when a playlist is selected
  useEffect(() => {
    const fetchPlaylistTracks = async () => {
      if (selectedPlaylist) {
        setLoadingTracks(true);
        setErrorLoadingTracks(null);
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylist.id}/tracks`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
              params: {
                fields: "items(track(id,name,artists(name)))",
                limit: 50, // Adjust as needed
              },
            }
          );
          const tracks = response.data.items.map((item) => ({
            id: item.track.id,
            name: item.track.name,
            artists: item.track.artists.map((artist) => artist.name).join(", "),
          }));
          setPlaylistTracks(tracks);
        } catch (error) {
          console.error("Error fetching playlist tracks:", error);
          setErrorLoadingTracks("Failed to load tracks.");
        } finally {
          setLoadingTracks(false);
        }
      } else {
        // Clear tracks when no playlist is selected
        setPlaylistTracks([]);
      }
    };

    fetchPlaylistTracks();
  }, [selectedPlaylist, token]);

  // Filter playlists containing '- PARTY' in their name
  const partyPlaylists = playlists.filter((playlist) =>
    playlist.name.includes("- PARTY")
  );

  // Format playlist names by removing '- PARTY'
  const formattedPlaylists = partyPlaylists.map((playlist) => ({
    ...playlist,
    name: playlist.name.replace("- PARTY", "").trim(),
  }));

  const handlePlaylistClick = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    const hour = e.target.hour.value;
    const minute = e.target.minute.value;
    const second = e.target.second.value;
    const ampm = e.target.ampm.value;

    // Convert to 24-hour time
    let hour24 = parseInt(hour);
    if (ampm === "PM" && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    const time = `${hour24.toString().padStart(2, "0")}:${minute.padStart(
      2,
      "0"
    )}:${second.padStart(2, "0")}`;

    // Check if shuffle is selected
    const shuffle = e.target.shuffle.checked;

    // Create a scheduled playlist object
    const scheduledPlaylist = {
      ...selectedPlaylist,
      time,
      shuffle,
      played: false, // To track if the playlist has been played
    };

    // Dispatch an action to add to the schedule
    dispatch({ type: reducerCases.ADD_TO_SCHEDULE, playlist: scheduledPlaylist });

    // Reset the selected playlist
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
  };

  // Handle back button click
  const handleBack = () => {
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
  };

  return (
    <Container>
      {selectedPlaylist ? (
        <div className="scheduler-container">
          {/* Back arrow button */}
          <button className="back-button" onClick={handleBack}>
            <IoArrowBack size={24} color="white" />
          </button>
          <div className="selected-playlist">
            <img src={selectedPlaylist.image} alt={selectedPlaylist.name} />
            <h3>{selectedPlaylist.name}</h3>
            {/* Scrollable tracks list */}
            <div className="tracks-container">
              {loadingTracks ? (
                <p>Loading tracks...</p>
              ) : errorLoadingTracks ? (
                <p>{errorLoadingTracks}</p>
              ) : (
                <ul>
                  {playlistTracks.map((track) => (
                    <li key={track.id}>
                      <span className="track-name">{track.name}</span>
                      <span className="track-artists">{track.artists}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="schedule-form">
            <h2>Select a time to schedule this playlist</h2>
            <form onSubmit={handleSchedule}>
              <div className="time-selectors">
                <select name="hour">
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
                <select name="minute">
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select name="second">
                  {[...Array(60)].map((_, i) => (
                    <option key={i} value={i.toString().padStart(2, "0")}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select name="ampm">
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
              <label className="shuffle-option">
                <input type="checkbox" name="shuffle" /> Shuffle Playlist
              </label>
              <button type="submit">Schedule</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <h2>Scheduler</h2>
          <p>Select a Playlist to Schedule</p>
          <div className="playlist-grid">
            {formattedPlaylists.map((playlist, index) => (
              <div
                className={`playlist-card-outer ${
                  selectedPlaylist ? "move-right" : ""
                }`}
                key={playlist.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePlaylistClick(playlist)}
              >
                <div className="playlist-card-inner">
                  <img src={playlist.image} alt={playlist.name} />
                  <h3>{playlist.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  color: white;
  overflow: hidden; /* Prevent overflow during the animation */

  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .playlist-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
    gap: 2rem;
  }

  /* Outer container: for fly-in animation */
  .playlist-card-outer {
    opacity: 0;
    transform: translateX(100%); /* Start off-screen */
    animation: flyIn 0.5s ease-in-out forwards; /* Fly-in animation */
    animation-fill-mode: forwards; /* Ensure it stays in the final position after animation */
    transition: transform 0.3s ease-in-out; /* Allows animation to run smoothly */

    &.move-right {
      animation: moveRight 0.5s forwards;
    }
  }

  /* Inner container: for hover effect */
  .playlist-card-inner {
    text-align: center;
    transition: transform 0.3s ease-in-out; /* Enables hover scaling */

    img {
      width: 100%;
      max-width: 200px;
      height: 200px;
      border-radius: 8px;
      object-fit: cover;
      transition: transform 0.3s ease-in-out; /* Enables hover scaling */
    }

    h3 {
      margin-top: 0.5rem;
      font-size: 1.2rem;
    }

    /* Hover effect */
    &:hover {
      transform: scale(1.15); /* Scale up when hovered */
    }
  }

  @keyframes flyIn {
    from {
      transform: translateX(100%); /* Fly in from the right */
      opacity: 0;
    }
    to {
      transform: translateX(0); /* End in place */
      opacity: 1;
    }
  }

  @keyframes moveRight {
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .scheduler-container {
    position: relative; /* To position the back button */
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;

    .back-button {
      position: absolute;
      top: 10px;
      left: 10px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 1;
    }

    .selected-playlist {
      flex: 1 1 40%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        width: 100%;
        max-width: 400px;
        border-radius: 8px;
      }
      h3 {
        margin-top: 1rem;
        font-size: 2rem;
      }

      .tracks-container {
        margin-top: 1rem;
        width: 100%;
        max-width: 400px;
        max-height: 200px; /* Adjust as needed */
        overflow-y: auto;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 8px;

        p {
          color: #ccc;
        }

        ul {
          list-style-type: none;
          padding: 0;
          margin: 0;

          li {
            display: flex;
            flex-direction: column;
            margin-bottom: 0.5rem;

            .track-name {
              font-weight: bold;
            }

            .track-artists {
              font-size: 0.9rem;
              color: #ccc;
            }
          }
        }
      }
    }

    .schedule-form {
      flex: 1 1 50%;
      padding: 2rem;
      background-color: rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      h2 {
        margin-bottom: 1rem;
      }
      form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .time-selectors {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          select {
            padding: 0.5rem;
            font-size: 1rem;
            border-radius: 4px;
            border: none;
          }
        }

        .shuffle-option {
          margin-bottom: 1rem;
          input {
            margin-right: 0.5rem;
          }
        }

        button {
          padding: 0.5rem 1rem;
          font-size: 1rem;
          background-color: #1db954;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          &:hover {
            background-color: #1aa34a;
          }
        }
      }
    }
  }
`;