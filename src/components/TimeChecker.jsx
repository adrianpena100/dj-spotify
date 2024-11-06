// src/components/TimeChecker.jsx
import { useEffect, useCallback } from "react";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function TimeChecker() {
  const [{ scheduledPlaylists, token }, dispatch] = useStateProvider();

  const playPlaylist = useCallback(async (playlistId) => {
    try {
      await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context_uri: `spotify:playlist:${playlistId}`,
        }),
      });
    } catch (error) {
      console.error("Error playing playlist:", error);
    }
  }, [token]);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      scheduledPlaylists.forEach((playlist) => {
        if (playlist.time === currentTime && !playlist.played) {
          // Trigger playback
          playPlaylist(playlist.id);
          // Mark the playlist as played
          dispatch({ type: reducerCases.MARK_PLAYLIST_PLAYED, id: playlist.id });
        }
      });
    };

    const interval = setInterval(checkTime, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [scheduledPlaylists, dispatch, playPlaylist]);

  return null;
}