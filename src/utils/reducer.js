// Reducer.js
import { reducerCases } from "./Constants";

export const initialState = {
  token: null,
  userInfo: null,
  playlists: [],
  currentPlaying: null,
  playerState: false,
  selectedPlaylist: null,
  playerInstance: null,
  progress: 0,
  duration: 0,
  selectedPlaylistId: "37i9dQZF1DXcBWIGoYBM5M",
  updatePlaylists: false,
  deviceId: null, // Added this line
};

const reducer = (state, action) => {
  switch (action.type) {
    case reducerCases.SET_TOKEN:
      return {
        ...state,
        token: action.token,
      };
    case reducerCases.SET_USER:
      return {
        ...state,
        userInfo: action.userInfo,
      };
    case reducerCases.SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.playlists,
        updatePlaylists: false, // Reset the update flag here
      };
    case reducerCases.SET_PLAYING:
      return {
        ...state,
        currentPlaying: action.currentPlaying,
      };
    case reducerCases.SET_PLAYER_STATE:
      return {
        ...state,
        playerState: action.playerState,
      };
    case reducerCases.SET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.selectedPlaylist,
      };
    case reducerCases.SET_PLAYLIST_ID:
      return {
        ...state,
        selectedPlaylistId: action.selectedPlaylistId,
      };
    case reducerCases.SET_DEVICE_ID: // Added this case
      return {
        ...state,
        deviceId: action.deviceId,
      };
    case reducerCases.SET_SHUFFLE_STATE:
        return {
          ...state,
          shuffleState: action.shuffleState,
        };
    case reducerCases.SET_REPEAT_STATE:
        return {
          ...state,
          repeatState: action.repeatState,
        };
    case reducerCases.SET_UPDATE_PLAYLISTS:
      return {
        ...state,
        updatePlaylists: true,
      };
    default:
        return state;
}
};

export default reducer;
