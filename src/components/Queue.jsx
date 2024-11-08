import React from 'react';
import { useStateProvider } from '../utils/StateProvider';
import '../styles/Queue.css'; // Import the CSS file

export default function Queue() {
  const [{ scheduledPlaylists }] = useStateProvider();

  return (
    <div className="queue-container">
      <h2>Scheduled Playlists</h2>
      {scheduledPlaylists && scheduledPlaylists.length > 0 ? (
        <ul>
          {scheduledPlaylists.map((playlist, index) => (
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