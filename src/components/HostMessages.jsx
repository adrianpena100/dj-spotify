// src/components/HostMessages.jsx
import React, { useEffect, useState } from "react";
import "../styles/HostMessages.css"; // Create this CSS file for styling

export default function HostMessages() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      const response = await fetch("http://localhost:5001/requests");
      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleClear = async () => {
    try {
      const response = await fetch("http://localhost:5001/requests/clear", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to clear requests");
      }
      setRequests([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="HostMessagesContainer">
      <h2>Guest Song Requests</h2>
      {loading && <p>Loading requests...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && !error && (
        <>
          {requests.length === 0 ? (
            <p>No song requests yet.</p>
          ) : (
            <ul className="requests-list">
              {requests.map((req) => (
                <li key={req.id}>
                  <span className="song-name">{req.songName}</span>
                  <span className="timestamp">
                    {new Date(req.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {requests.length > 0 && (
            <button className="clear-button" onClick={handleClear}>
              Clear All Requests
            </button>
          )}
        </>
      )}
    </div>
  );
}
