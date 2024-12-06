// src/components/GuestEntry.jsx
import React, { useState } from "react";
import "../styles/GuestEntry.css"; // Ensure this CSS file exists

export default function GuestEntry() {
  const [songName, setSongName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (songName.trim() === "") {
      setMessage("Please enter a song name.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/request-song", { // Ensure backend is on 5001
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ songName }),
      });

      if (response.ok) {
        setMessage("Your request has been submitted!");
        setSongName("");
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="GuestContainer">
      <h2>Submit Your Song Request</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          placeholder="Enter song name"
          required
        />
        <button type="submit">Submit Request</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}
