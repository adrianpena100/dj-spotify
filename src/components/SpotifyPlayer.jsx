// SpotifyPlayer.jsx
import { useEffect } from "react"; // Removed 'React' from the import
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function SpotifyPlayer() {
  const [{ token }, dispatch] = useStateProvider();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new window.Spotify.Player({
        name: "Your Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
        volume: 0.5,
      });

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        dispatch({ type: reducerCases.SET_DEVICE_ID, deviceId: device_id });
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state) => {
        if (!state) {
          return;
        }
        const {
          current_track: currentTrack,
        } = state.track_window;
        const currentPlaying = {
          id: currentTrack.id,
          name: currentTrack.name,
          artists: currentTrack.artists.map((artist) => artist.name),
          image: currentTrack.album.images[2].url,
        };
        dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
        dispatch({
          type: reducerCases.SET_PLAYER_STATE,
          playerState: !state.paused,
        });
      });

      player.connect();
    };
  }, [token, dispatch]);

  return null;
}
