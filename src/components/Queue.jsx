import React, { useEffect, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import "../styles/Queue.css";

export default function Queue() {
  const [{ scheduledPlaylists }, dispatch] = useStateProvider();

  const removePlaylist = (index) => {
    const updatedPlaylists = scheduledPlaylists.filter((_, i) => i !== index);
    dispatch({
      type: "SET_SCHEDULED_PLAYLISTS",
      scheduledPlaylists: updatedPlaylists,
    });
  };

  const editPlaylistTime = (index, newTime) => {
    const updatedPlaylists = scheduledPlaylists.map((playlist, i) =>
      i === index ? { ...playlist, time: newTime } : playlist
    );
    dispatch({
      type: "SET_SCHEDULED_PLAYLISTS",
      scheduledPlaylists: updatedPlaylists,
    });
  };

  const sortedPlaylists = scheduledPlaylists
    .slice() // Create a new array to avoid mutating state directly
    .sort((a, b) => {
      const timeA = new Date(`1970-01-01T${a.time}:00`);
      const timeB = new Date(`1970-01-01T${b.time}:00`);
      return timeA - timeB;
    });

  return (
    <div className="QContainer">
      <h2>Scheduled Playlists</h2>
      {sortedPlaylists.length > 0 ? (
        <ul>
          {sortedPlaylists.map((playlist, index) => (
            <li key={index}>
              <div className="playlist-info">
                <img src={playlist.image} alt={playlist.name} />
                <div>
                  <h3>{playlist.name}</h3>
                  <p>Scheduled at: {playlist.time}</p>
                  {playlist.played ? (
                    <span className="played-label">Played</span>
                  ) : (
                    <span className="pending-label">Pending</span>
                  )}
                  <button onClick={() => removePlaylist(index)}>Remove</button>
                  <button
                    onClick={() => {
                      const newTime = prompt(
                        "Enter new time (HH:MM:SS)",
                        playlist.time
                      );
                      if (newTime) editPlaylistTime(index, newTime);
                    }}
                  >
                    Edit Time
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists scheduled.</p>
      )}
    </div>
  );
}
