// src/components/Navbar.jsx

import React, { useState } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi"; // Import logout icon
import { reducerCases } from "../utils/Constants";

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
    <Container navBackground={navBackground}>
      <div className="search__bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Artists, songs, or podcasts"
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  .search__bar {
    background-color: white;
    width: 30%;
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    input {
      border: none;
      height: 2rem;
      width: 100%;
      &:focus {
        outline: none;
      }
    }
  }
  .user-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      background-color: black;
      padding: 0.3rem 0.4rem;
      padding-right: 1rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: white;
        font-weight: bold;
        svg {
          font-size: 1.3rem;
          background-color: #282828;
          padding: 0.2rem;
          border-radius: 1rem;
          color: #c7c5c5;
        }
      }
    }
    .logout-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1rem;
      svg {
        font-size: 1.5rem;
      }
    }
  }
`;
