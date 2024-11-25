import React from 'react';
import { AiFillClockCircle } from 'react-icons/ai';
import '../styles/Body.css';

export default function DisplayPlaylists({ selectedPlaylist, playTrack, msToMinutesAndSeconds }) {
  return (
    <>
      <div className="playlist">
        <div className="image">
          <img src={selectedPlaylist.image} alt="selected playlist" />
        </div>
        <div className="details">
          <span className="type">PLAYLIST</span>
          <h1 className="title">{selectedPlaylist.name}</h1>
          <p className="description">{selectedPlaylist.description}</p>
        </div>
      </div>
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
          {selectedPlaylist.tracks.length > 0 ? (
            selectedPlaylist.tracks.map(
              (
                {
                  id,
                  name,
                  artists,
                  image,
                  duration,
                  album,
                  track_number_in_playlist,
                },
                index
              ) => {
                return (
                  <div
                    className="row"
                    key={`${id}-${index}`}
                    onClick={() =>
                      playTrack(
                        id,
                        name,
                        artists,
                        image,
                        track_number_in_playlist
                      )
                    }
                  >
                    <div className="col">
                      <span>{index + 1}</span>
                    </div>
                    <div className="col detail">
                      <div className="image">
                        <img src={image} alt="track" />
                      </div>
                      <div className="info">
                        <span className="name">{name}</span>
                        <span>{artists.join(', ')}</span>
                      </div>
                    </div>
                    <div className="col">
                      <span>{album}</span>
                    </div>
                    <div className="col">
                      <span>{msToMinutesAndSeconds(duration)}</span>
                    </div>
                  </div>
                );
              }
            )
          ) : (
            <div className="no-tracks">
              <span>This playlist is empty.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
