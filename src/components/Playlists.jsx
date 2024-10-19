import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";
import { reducerCases } from "../utils/Constants";
import { useStateProvider } from "../utils/StateProvider";

export default function Playlists() {
  const [{ token, playlists, updatePlaylists }, dispatch] = useStateProvider();

  useEffect(() => {
    const getPlaylistData = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );

      const { items } = response.data;

      // Filter playlists containing "- PARTY"
      const filteredItems = items.filter(({ name }) =>
        name.includes("- PARTY")
      );

      // Map over the filtered playlists to include images
      const playlists = filteredItems.map(({ name, id, images }) => {
        return {
          name,
          id,
          image: images?.[0]?.url || "https://i.vinylcloud.io/404.svg", // Use default image if no image available
        };
      });

      dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
    };
    getPlaylistData();
  }, [token, dispatch, updatePlaylists]);

  const changeCurrentPlaylist = (selectedPlaylistId) => {
    dispatch({ type: reducerCases.SET_PLAYLIST_ID, selectedPlaylistId });
  };

  return (
    <Container>
      <ul>
        {playlists.map(({ name, id, image }) => {
          // Remove "- PARTY" from the displayed name
          const displayName = name.replace("- PARTY", "").trim();
          return (
            <li key={id} onClick={() => changeCurrentPlaylist(id)}>
              <div className="playlist-item">
                <img src={image} alt="Playlist Art" />
                <span>{displayName}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}

const Container = styled.div`
  color: #b3b3b3;
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    .playlist-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease-in-out;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      img {
        height: 40px;
        width: 40px;
        object-fit: cover;
        border-radius: 4px;
      }
      span {
        font-size: 0.9rem;
        color: inherit;
      }
    }
  }
`;
