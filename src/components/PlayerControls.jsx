// PlayerControls.jsx
import React, { useEffect } from "react";
import styled from "styled-components";
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

export default function PlayerControls() {
  const [
    { token, playerState, deviceId, shuffleState, repeatState },
    dispatch,
  ] = useStateProvider();

  useEffect(() => {
    const getPlaybackMode = async () => {
      const response = await axios.get("https://api.spotify.com/v1/me/player", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        params: {
          device_id: deviceId,
        },
      });
      dispatch({
        type: reducerCases.SET_SHUFFLE_STATE,
        shuffleState: response.data.shuffle_state,
      });
      dispatch({
        type: reducerCases.SET_REPEAT_STATE,
        repeatState: response.data.repeat_state,
      });
    };
    getPlaybackMode();
  }, [token, deviceId, dispatch]);

  const changeState = async () => {
    const state = playerState ? "pause" : "play";
    await axios.put(
      `https://api.spotify.com/v1/me/player/${state}?device_id=${deviceId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({
      type: reducerCases.SET_PLAYER_STATE,
      playerState: !playerState,
    });
  };

  const changeTrack = async (type) => {
    await axios.post(
      `https://api.spotify.com/v1/me/player/${type}?device_id=${deviceId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
  };

  const toggleShuffle = async () => {
    const newShuffleState = !shuffleState;
    await axios.put(
      `https://api.spotify.com/v1/me/player/shuffle?state=${newShuffleState}&device_id=${deviceId}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
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
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    dispatch({
      type: reducerCases.SET_REPEAT_STATE,
      repeatState: newRepeatState,
    });
  };

  return (
    <Container>
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
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; /* Center the controls */
  gap: 2rem;

  svg {
    color: #b3b3b3;
    transition: 0.2s ease-in-out;
    cursor: pointer;
    &:hover {
      color: white;
    }
  }

  .state {
    svg {
      color: white; /* Ensure the play/pause button is visible */
    }
  }

  .previous,
  .next,
  .state {
    font-size: 2rem; /* Adjust the size if necessary */
  }

  .shuffle,
  .repeat {
    svg {
      font-size: 1.5rem;
    }
  }
`;
