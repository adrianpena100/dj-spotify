import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillClockCircle } from "react-icons/ai";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";

export default function SearchSong({ searchTerm }) {
  const [{ token, deviceId }, dispatch] = useStateProvider();
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (searchTerm) {
      const searchForSongs = async () => {
        try {
          const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${searchTerm}&type=track`,
            {
              headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json",
              },
            }
          );
          const tracks = response.data.tracks.items.map((track) => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map((artist) => artist.name).join(", "),
            album: track.album.name,
            image: track.album.images[2]?.url || "https://i.vinylcloud.io/404.svg",
            duration: track.duration_ms,
            uri: track.uri,
          }));

          setSearchResults(tracks);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      searchForSongs();
    } else {
      setSearchResults([]); // Clear results if no search term
    }
  }, [searchTerm, token]);

  const playTrack = async (id, name, artists, image, uri) => {
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,  // Use deviceId from state
        {
          uris: [uri],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      const currentPlaying = {
        id,
        name,
        artists: artists.split(", "),  // Make sure artists is an array
        image,
      };
      dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
      dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
    } catch (error) {
      console.error("Error playing the track:", error);
    }
  };
  

  const msToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <>
      <div className="list">
        <div className="header-row">
          <div className="col">
            <span>#</span>
          </div>
          <div className="col">
            <span>TITLE</span>
          </div>
          <div className="col">
            <span>ALBUM</span>
          </div>
          <div className="col">
            <span>
              <AiFillClockCircle />
            </span>
          </div>
        </div>
        <div className="tracks">
          {searchResults.length > 0 ? (
            searchResults.map((track, index) => (
              <div
                className="row"
                key={track.id}
                onClick={() =>
                  playTrack(track.id, track.name, track.artists, track.image, track.uri)
                }
              >
                <div className="col">
                  <span>{index + 1}</span>
                </div>
                <div className="col detail">
                  <div className="image">
                    <img src={track.image} alt="track" />
                  </div>
                  <div className="info">
                    <span className="name">{track.name}</span>
                    <span>{track.artists}</span>
                  </div>
                </div>
                <div className="col">
                  <span>{track.album}</span>
                </div>
                <div className="col">
                  <span>{msToMinutesAndSeconds(track.duration)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <span>No results found</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
