// reducer.js
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
  deviceId: null,
  repeatState: "off",
  scheduledPlaylists: [],
  volume: 10,
  isMuted: false,
  previousVolume: 10,
  playlistsCache: {},
  queue: [],
  resetScheduler: false,
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
        updatePlaylists: false,
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
    case reducerCases.SET_DEVICE_ID:
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
    case reducerCases.SET_VOLUME:
      return {
        ...state,
        volume: action.volume,
      };
    case reducerCases.SET_PREVIOUS_VOLUME:
      return {
        ...state,
        previousVolume: action.previousVolume,
      };
    case reducerCases.SET_MUTED:
      return {
        ...state,
        isMuted: action.isMuted,
      };
    case reducerCases.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.searchTerm,
      };
    case reducerCases.SET_PROGRESS:
      return {
        ...state,
        progress: action.progress,
      };
    case reducerCases.SET_DURATION:
      return {
        ...state,
        duration: action.duration,
      };
    case reducerCases.SET_SELECTED_VIEW:
      return {
        ...state,
        selectedView: action.selectedView,
      };
    case reducerCases.SET_SCHEDULED_PLAYLISTS:
      return {
        ...state,
        scheduledPlaylists: action.scheduledPlaylists,
      };
    case reducerCases.ADD_TO_SCHEDULE:
      return {
        ...state,
        scheduledPlaylists: [...state.scheduledPlaylists, action.playlist],
      };
    case reducerCases.MARK_PLAYLIST_PLAYED:
      return {
        ...state,
        scheduledPlaylists: state.scheduledPlaylists.map((playlist) =>
          playlist.id === action.id ? { ...playlist, played: true } : playlist
        ),
      };
    case reducerCases.ADD_PLAYLIST_TO_CACHE:
      return {
        ...state,
        playlistsCache: {
          ...state.playlistsCache,
          [action.id]: action.playlist,
        },
      };
    case reducerCases.RESET_SCHEDULER:
      return {
        ...state,
        resetScheduler: true,
      };
    case reducerCases.CLEAR_RESET_SCHEDULER:
      return {
        ...state,
        resetScheduler: false,
      };
    default:
      return state;
  }
};

export default reducer;