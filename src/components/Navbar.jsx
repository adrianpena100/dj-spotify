// src/components/Navbar.jsx

import React, { useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi"; // Import logout icon
import { reducerCases } from "../utils/Constants";
import "../styles/Navbar.css"; // Import the new CSS file

export default function Navbar({ navBackground }) {
  const [{ userInfo }, dispatch] = useStateProvider();
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search input and update global state
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: e.target.value });
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      dispatch({ type: reducerCases.SET_SEARCH_TERM, searchTerm: e.target.value });
    }
  };

  const handleLogout = () => {
    dispatch({ type: reducerCases.SET_TOKEN, token: null });
    dispatch({ type: reducerCases.CLEAR_SCHEDULED_PLAYLISTS });
    window.location.href = '/'; // Redirect to login
  };

  return (
    <div className={`navbar ${navBackground ? "navbar--active" : ""}`}>
      <div className="search__bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search a song"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
        />
      </div>
      <div className="user-actions">
        <div className="avatar">
          <a href={userInfo?.userUrl}>
            <CgProfile />
            <span>{userInfo?.name}</span>
          </a>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <FiLogOut />
          Logout
        </button>
      </div>
    </div>
  );
}