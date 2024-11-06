// src/components/Queue.jsx
import React from 'react';
import styled from 'styled-components';
import { useStateProvider } from '../utils/StateProvider';

export default function Queue() {
  const [{ scheduledPlaylists }] = useStateProvider();

  // Sort playlists by time
  const sortedPlaylists = scheduledPlaylists.sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}:00`);
    const timeB = new Date(`1970-01-01T${b.time}:00`);
    return timeA - timeB;
  });

  return (
    <Container>
      <h2>Scheduled Playlists</h2>
      {sortedPlaylists && sortedPlaylists.length > 0 ? (
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
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No playlists scheduled.</p>
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem;
  color: white;

  h2 {
    margin-bottom: 2rem;
    font-size: 2.5rem;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      background-color: #282828;
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;

      .playlist-info {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
          width: 64px;
          height: 64px;
          border-radius: 8px;
        }

        h3 {
          margin: 0;
        }

        p {
          margin: 0.5rem 0 0;
          color: #b3b3b3;
        }

        .played-label {
          color: #1db954;
          font-weight: bold;
        }

        .pending-label {
          color: #ffa500;
          font-weight: bold;
        }
      }
    }
  }

  p {
    font-size: 1.2rem;
  }
`;