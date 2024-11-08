import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import { IoArrowBack } from "react-icons/io5"; // Import the back arrow icon
import '../styles/Scheduler.css'; // Import the CSS file

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
    )}`;

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
    <div className="scheduler-container">
      {selectedPlaylist ? (
        <>
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
                  {["00", "15", "30", "45"].map((m) => (
                    <option key={m} value={m}>
                      {m}
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
        </>
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
    </div>
  );
}