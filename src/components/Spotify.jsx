// src/components/Spotify.jsx
import React, { useEffect, useRef, useState } from "react"; // Added 'useState' here
import Sidebar from "./Sidebar";
import styled from "styled-components";
import Footer from "./Footer";
import Navbar from "./Navbar";
import axios from "axios";
import { useStateProvider } from "../utils/StateProvider";
import Body from "./Body";
import { reducerCases } from "../utils/Constants";
import SpotifyPlayer from "./SpotifyPlayer";

export default function Spotify() {
  const [{ token, scheduledPlaylists, deviceId }, dispatch] = useStateProvider();
  const bodyRef = useRef();
  const intervalRef = useRef(null);

  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);

  const bodyScrolled = () => {
    bodyRef.current.scrollTop >= 30
      ? setNavBackground(true)
      : setNavBackground(false);
    bodyRef.current.scrollTop >= 268
      ? setHeaderBackground(true)
      : setHeaderBackground(false);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const { data } = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });
      const userInfo = {
        userId: data.id,
        userUrl: data.external_urls.spotify,
        name: data.display_name,
      };
      dispatch({ type: reducerCases.SET_USER, userInfo });
    };
    getUserInfo();
  }, [dispatch, token]);

  useEffect(() => {
    const getPlaybackState = async () => {
      const { data } = await axios.get(
        "https://api.spotify.com/v1/me/player",
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      dispatch({
        type: reducerCases.SET_PLAYER_STATE,
        playerState: data && data.is_playing,
      });
    };
    getPlaybackState();
  }, [dispatch, token]);

  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes()
        .toString()
        .padStart(2, '0')}`;

      scheduledPlaylists.forEach(async (playlist) => {
        if (playlist.time === currentTime && !playlist.played) {
          try {
            if (playlist.shuffle) {
              await axios.put(
                `https://api.spotify.com/v1/me/player/shuffle?state=true&device_id=${deviceId}`,
                {},
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
            } else {
              await axios.put(
                `https://api.spotify.com/v1/me/player/shuffle?state=false&device_id=${deviceId}`,
                {},
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
            }

            await axios.put(
              `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
              {
                context_uri: playlist.uri,
                offset: { position: 0 },
                position_ms: 0,
              },
              {
                headers: {
                  Authorization: "Bearer " + token,
                  "Content-Type": "application/json",
                },
              }
            );

            dispatch({
              type: reducerCases.MARK_PLAYLIST_PLAYED,
              id: playlist.id,
            });
          } catch (error) {
            console.error("Error playing scheduled playlist:", error);
          }
        }
      });
    };

    if (scheduledPlaylists && scheduledPlaylists.length > 0) {
      intervalRef.current = setInterval(checkSchedule, 60000); // Check every minute
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [scheduledPlaylists, token, deviceId, dispatch]);

  return (
    <Container>
      <div className="spotify__body">
        <Sidebar />
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            <Body headerBackground={headerBackground} />
          </div>
        </div>
      </div>
      <div className="spotify__footer">
        <Footer />
      </div>
      <SpotifyPlayer />
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 90vh 15vh;
  .spotify__body {
    display: grid;
    grid-template-columns: 15vw 85vw;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 160, 100);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
        max-height: 2rem;
        &-thumb {
          background-color: rgba(255, 255, 255, 0.6);
        }
      }
    }
  }
`;
