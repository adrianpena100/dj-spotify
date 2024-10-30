import axios from "axios";
import React, { useCallback } from "react";
import styled from "styled-components";
import { GoUnmute, GoMute } from "react-icons/go"; // Import icons
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function Volume() {
  const [{ token, deviceId, volume, isMuted, previousVolume }, dispatch] = useStateProvider();

  const setVolumeOnSpotify = useCallback(async (newVolume) => {
    try {
      await axios.put(
        "https://api.spotify.com/v1/me/player/volume",
        {},
        {
          params: {
            volume_percent: newVolume,
            device_id: deviceId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
    } catch (error) {
      console.error("Error setting volume on Spotify:", error);
    }
  }, [deviceId, token]);

  const handleVolumeChange = async (e) => {
    const newVolume = parseInt(e.target.value, 10);

    if (newVolume === 0) {
      dispatch({ type: reducerCases.SET_MUTED, isMuted: true });
    } else {
      dispatch({ type: reducerCases.SET_MUTED, isMuted: false });
    }

    dispatch({ type: reducerCases.SET_VOLUME, volume: newVolume });
    await setVolumeOnSpotify(newVolume);
  };

  const toggleMute = useCallback(async () => {
    try {
      if (isMuted) {
        const restoredVolume = previousVolume > 0 ? previousVolume : 50;
        dispatch({ type: reducerCases.SET_VOLUME, volume: restoredVolume });
        dispatch({ type: reducerCases.SET_MUTED, isMuted: false });
        await setVolumeOnSpotify(restoredVolume);
      } else {
        dispatch({ type: reducerCases.SET_PREVIOUS_VOLUME, previousVolume: volume });
        dispatch({ type: reducerCases.SET_VOLUME, volume: 0 });
        dispatch({ type: reducerCases.SET_MUTED, isMuted: true });
        await setVolumeOnSpotify(0);
      }
    } catch (error) {
      console.error("Error toggling mute:", error);
    }
  }, [isMuted, previousVolume, volume, dispatch, setVolumeOnSpotify]);

  return (
    <Container>
      <button onClick={toggleMute}>
        {isMuted ? <GoMute size={24} color="white" /> : <GoUnmute size={24} color="white" />}
      </button>
      <input
        type="range"
        onChange={handleVolumeChange}
        onMouseUp={handleVolumeChange}
        value={volume}
        min={0}
        max={100}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  input {
    width: 15rem;
    border-radius: 2rem;
    height: 0.5rem;
    background: white; /* White track */
    -webkit-appearance: none;
    appearance: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954; /* Spotify green */
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954; /* Spotify green */
      cursor: pointer;
    }

    &::-ms-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #1db954; /* Spotify green */
      cursor: pointer;
    }
  }
`;
