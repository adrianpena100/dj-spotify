// src/components/Body.jsx

import axios from "axios";
import React, { useEffect } from "react";
import styled from "styled-components";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import DisplayPlaylists from "./DisplayPlaylists";
import SearchSong from "./SearchSong";
import Scheduler from "./Scheduler";
import Queue from "./Queue";

export default function Body({ headerBackground }) {
  const [
    {
      token,
      selectedPlaylist,
      selectedPlaylistId,
      deviceId,
      searchTerm,
      selectedView,
      updatePlaylists,
      notification,
    },
    dispatch,
  ] = useStateProvider();

  useEffect(() => {
    if (selectedPlaylistId && !selectedView) {
      const getPlaylist = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/playlists/${selectedPlaylistId}`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );

          const data = response.data;

          const playlistImage =
            data.images?.[0]?.url || "https://i.vinylcloud.io/404.svg";
          const tracks =
            data.tracks.items.length > 0
              ? data.tracks.items.map(({ track }, index) => ({
                  id: track.id,
                  name: track.name,
                  artists: track.artists.map((artist) => artist.name),
                  image:
                    track.album.images[2]?.url ||
                    "https://i.vinylcloud.io/404.svg",
                  duration: track.duration_ms,
                  album: track.album.name,
                  track_number_in_playlist: index,
                }))
              : [];

          const selectedPlaylist = {
            id: data.id,
            name: data.name.replace("- PARTY", "").trim(),
            description: data.description.startsWith("<a")
              ? ""
              : data.description,
            image: playlistImage,
            uri: data.uri,
            tracks: tracks,
          };

          // Set the selected playlist
          dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });

          // Reset updatePlaylists flag
          if (updatePlaylists) {
            dispatch({
              type: reducerCases.SET_UPDATE_PLAYLISTS,
              updatePlaylists: false,
            });
          }
        } catch (error) {
          console.error("Error fetching playlist data:", error);
        }
      };
      getPlaylist();
    }
  }, [
    token,
    dispatch,
    selectedPlaylistId,
    selectedView,
    updatePlaylists,
  ]);

  const playTrack = async (
    id,
    name,
    artists,
    image,
    track_number_in_playlist,
    duration
  ) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          context_uri: selectedPlaylist.uri,
          offset: { position: track_number_in_playlist },
          position_ms: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const currentPlaying = { id, name, artists, image };
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
      dispatch({ type: reducerCases.SET_PROGRESS, progress: 0 });
      dispatch({ type: reducerCases.SET_DURATION, duration });
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  // Clear the notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: reducerCases.CLEAR_NOTIFICATION });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  return (
    <Container headerBackground={headerBackground}>
      {notification && <div className="notification">{notification}</div>}
      {searchTerm ? (
        <SearchSong searchTerm={searchTerm} />
      ) : selectedView ? (
        // Render the selected view based on selectedView
        renderSelectedView()
      ) : selectedPlaylist ? (
        <DisplayPlaylists
          selectedPlaylist={selectedPlaylist}
          playTrack={playTrack}
          msToMinutesAndSeconds={msToMinutesAndSeconds}
        />
      ) : null}
    </Container>
  );

  function renderSelectedView() {
    switch (selectedView) {
      case "SCHEDULER":
        return <Scheduler />;
      case "QUEUE":
        return <Queue />;
      // Add other views if any
      default:
        return null;
    }
  }
}

const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        width: 15rem;
        object-fit: cover;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr 0.1fr; /* Adjusted to add a new column */
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
        headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr 0.1fr; /* Adjusted to add a new column */
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 40px;
            width: 40px;
            object-fit: cover;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
      .no-tracks {
        padding: 2rem;
        text-align: center;
        color: #999;
        font-size: 1.2rem;
      }
    }
  }
`;
