import React, { useEffect, useRef, useState, useCallback } from "react";
// import styled from "styled-components";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Constants";
import "../styles/PlayerControls.css";

export default function PlayerControls() {
  const [
    { token, playerState, deviceId, shuffleState, repeatState, progress, duration },
    dispatch,
  ] = useStateProvider();

  const [isSeeking, setIsSeeking] = useState(false); // Track seeking state
  const [manualSeek, setManualSeek] = useState(false); // Track if seeking was manual

  const progressIntervalRef = useRef(null);

  useEffect(() => {
    const getPlaybackInfo = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/player",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              device_id: deviceId,
            },
          }
        );
        if (response.data && response.data.item) {
          dispatch({ type: reducerCases.SET_PROGRESS, progress: response.data.progress_ms });
          dispatch({ type: reducerCases.SET_DURATION, duration: response.data.item.duration_ms });
        }
      } catch (error) {
        console.error("Error getting playback info:", error);
      }
    };

    if (playerState) {
      getPlaybackInfo(); // Fetch playback info immediately on first play
      progressIntervalRef.current = setInterval(() => {
        dispatch({
          type: reducerCases.SET_PROGRESS,
          progress: Math.min(progress + 1000, duration),
        });
      }, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }

    return () => clearInterval(progressIntervalRef.current);
  }, [token, deviceId, playerState, duration, dispatch, progress]);

  // Prevent changeTrack from running while seeking
  const changeTrack = useCallback(async (type) => {
    if (!isSeeking) {
      setIsSeeking(true); // Set seeking state to prevent further skips
      try {
        await axios.post(
          `https://api.spotify.com/v1/me/player/${type}?device_id=${deviceId}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });

        const response = await axios.get(
          "https://api.spotify.com/v1/me/player",
          {
            headers: {
              Authorization: "Bearer " + token,
            },
            params: {
              device_id: deviceId,
            },
          }
        );
        if (response.data && response.data.item) {
          dispatch({ type: reducerCases.SET_PROGRESS, progress: response.data.progress_ms });
          dispatch({ type: reducerCases.SET_DURATION, duration: response.data.item.duration_ms });
        }
      } catch (error) {
        console.error("Error changing track:", error);
      } finally {
        setIsSeeking(false); // Reset seeking state after track change
        setManualSeek(false); // Reset manual seek after track change
      }
    }
  }, [deviceId, dispatch, token, isSeeking]);

  useEffect(() => {
    // Auto-skip to next track when not seeking manually
    if (progress >= duration && playerState && !isSeeking && !manualSeek) {
      changeTrack("next");
    }
  }, [progress, duration, playerState, changeTrack, isSeeking, manualSeek]);

  const changeState = async () => {
    const state = playerState ? "pause" : "play";
    await axios.put(
      `https://api.spotify.com/v1/me/player/${state}?device_id=${deviceId}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });

    if (!playerState) {
      // Fetch playback info immediately after the play button is clicked
      const getPlaybackInfo = async () => {
        try {
          const response = await axios.get(
            "https://api.spotify.com/v1/me/player",
            {
              headers: {
                Authorization: "Bearer " + token,
              },
              params: {
                device_id: deviceId,
              },
            }
          );
          if (response.data && response.data.item) {
            dispatch({ type: reducerCases.SET_PROGRESS, progress: response.data.progress_ms });
            dispatch({ type: reducerCases.SET_DURATION, duration: response.data.item.duration_ms });
          }
        } catch (error) {
          console.error("Error getting playback info:", error);
        }
      };
      getPlaybackInfo();
    }
  };

  const toggleShuffle = async () => {
    const newShuffleState = !shuffleState;
    await axios.put(
      `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}&device_id=${deviceId}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({
      type: reducerCases.SET_SHUFFLE_STATE,
      shuffleState: newShuffleState,
    });
  };

  const cycleRepeat = async () => {
    let newRepeatState;
    if (repeatState === "off") {
      newRepeatState = "context";
    } else if (repeatState === "context") {
      newRepeatState = "track";
    } else {
      newRepeatState = "off";
    }
    await axios.put(
      `https://api.spotify.com/v1/me/player/repeat?state=${newRepeatState}&device_id=${deviceId}`,
      {},
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({
      type: reducerCases.SET_REPEAT_STATE,
      repeatState: newRepeatState,
    });
  };

  const handleProgressClick = async (e) => {
    const width = e.target.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newPosition = (clickX / width) * duration;

    setIsSeeking(true);  // Mark as seeking
    setManualSeek(true); // Mark as manual seek

    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(newPosition)}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      dispatch({ type: reducerCases.SET_PROGRESS, progress: newPosition });
    } catch (error) {
      console.error("Error seeking the track:", error.response?.data || error);
    } finally {
      // Add a short timeout to avoid double skips after seeking
      setTimeout(() => {
        setIsSeeking(false);  // Reset the seeking state after the delay
      }, 1000);
    }
  };

  const formatTime = (ms) => {
    if (!ms || isNaN(ms)) return "0:00";  // Default to "0:00" if the time is not available or invalid
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="PCContainer">
      <div className="controls">
        <div className="shuffle">
          <BsShuffle
            onClick={toggleShuffle}
            style={{ color: shuffleState ? "#1ed760" : "#b3b3b3" }}
          />
        </div>
        <div className="previous">
          <CgPlayTrackPrev onClick={() => changeTrack("previous")} />
        </div>
        <div className="state">
          {playerState ? (
            <BsFillPauseCircleFill onClick={changeState} />
          ) : (
            <BsFillPlayCircleFill onClick={changeState} />
          )}
        </div>
        <div className="next">
          <CgPlayTrackNext onClick={() => changeTrack("next")} />
        </div>
        <div className="repeat">
          <FiRepeat
            onClick={cycleRepeat}
            style={{ color: repeatState !== "off" ? "#1ed760" : "#b3b3b3" }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-container">
        <span>{formatTime(progress || 0)}</span> {/* Default to 0 if progress is null */}
        <div className="progress-bar" onClick={handleProgressClick}>
          <div
            className="progress"
            style={{ width: `${(progress / duration) * 100 || 0}%` }}
          ></div>
        </div>
        <span>{formatTime(duration || 0)}</span> {/* Default to 0 if duration is null */}
      </div>
    </div>
  );
}

// const Container = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
//   gap: 1rem;

//   .controls {
//     display: flex;
//     align-items: center;
//     gap: 2rem;
//   }

//   .progress-container {
//     display: flex;
//     align-items: center;
//     gap: 1rem;
//     width: 100%;
//     max-width: 500px;
//   }

//   .progress-bar {
//     flex: 1;
//     height: 8px;
//     background-color: #b3b3b3;
//     cursor: pointer;
//     border-radius: 4px;
//     overflow: hidden;
//   }

//   .progress {
//     height: 100%;
//     background-color: #1ed760;
//   }

//   .progress-container span {
//     color: white; /* Change the time color to white */
//   }

//   svg {
//     color: #b3b3b3;
//     transition: 0.2s ease-in-out;
//     cursor: pointer;
//     &:hover {
//       color: white;
//     }
//   }

//   .state svg {
//     color: white;
//   }

//   .previous,
//   .next,
//   .state {
//     font-size: 2rem;
//   }

//   .shuffle,
//   .repeat svg {
//     font-size: 1.5rem;
//   }
// `;
