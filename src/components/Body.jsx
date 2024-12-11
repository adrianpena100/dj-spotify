import axios from "axios";
import React, { useEffect, useState } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import DisplayPlaylists from "./DisplayPlaylists";
import SearchSong from "./SearchSong";
import Scheduler from "./Scheduler";
import Queue from "./Queue";
import "../styles/Body.css";
import { AiOutlineInbox } from "react-icons/ai";

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
      sessionId,
    },
    dispatch,
  ] = useStateProvider();

  const [showInbox, setShowInbox] = useState(false);
  const [guestMessages, setGuestMessages] = useState([]);
  const [adminSessionId, setAdminSessionId] = useState("");

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      dispatch({ type: reducerCases.SET_SESSION_ID, sessionId: storedSessionId });
    }
  }, [dispatch]);

  const fetchMessages = async (sessionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/${sessionId}`);
      const data = await response.json();
      setGuestMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchMessages(sessionId);
    }
  }, [sessionId]);

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

          dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist });

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
  }, [token, dispatch, selectedPlaylistId, selectedView, updatePlaylists]);

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

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch({ type: reducerCases.CLEAR_NOTIFICATION });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  return (
    <div className={`Container ${headerBackground ? "headerBackground" : ""}`}>
      {notification && <div className="notification">{notification}</div>}
      <div className="inbox-icon" onClick={() => setShowInbox(!showInbox)}>
        <AiOutlineInbox size={30} />
      </div>
      {showInbox && (
        <div className="inbox">
          <h2>Guest Messages</h2>
          <input
            type="text"
            value={adminSessionId}
            onChange={(e) => setAdminSessionId(e.target.value)}
            placeholder="Enter Session ID"
          />
          <button onClick={() => fetchMessages(adminSessionId)}>Fetch Messages</button>
          {guestMessages.length > 0 ? (
            guestMessages.map((message, index) => (
              <div key={index} className="message">
                {message}
              </div>
            ))
          ) : (
            <div>No messages</div>
          )}
        </div>
      )}
      {searchTerm ? (
        <SearchSong searchTerm={searchTerm} />
      ) : selectedView ? (
        renderSelectedView()
      ) : selectedPlaylist ? (
        <DisplayPlaylists
          selectedPlaylist={selectedPlaylist}
          playTrack={playTrack}
          msToMinutesAndSeconds={msToMinutesAndSeconds}
        />
      ) : null}
    </div>
  );

  function renderSelectedView() {
    switch (selectedView) {
      case "SCHEDULER":
        return <Scheduler />;
      case "QUEUE":
        return <Queue />;
      default:
        return null;
    }
  }
}