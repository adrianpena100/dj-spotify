# Spotify Scheduler

Spotify Scheduler is a client-side web application designed to act as an alternative to hiring a DJ. It allows users to schedule and manage playlists, creating a dynamic and interactive music experience. With Spotify Scheduler, users can set up playlists to play automatically, add or reorder songs, and interact with the music queue—all powered by Spotify's vast music library. This makes it perfect for parties, events, or any gathering where music is essential but hiring a DJ is unnecessary.

## Project Purpose

The Spotify Scheduler aims to simplify music management by automating playlist playback based on a pre-set schedule. Instead of relying on a DJ to control the playlist, hosts and guests can engage with the app to modify the music queue, ensuring that the playlist evolves to match the event's energy and guest preferences. By leveraging the Spotify Web API, the app provides a seamless experience with minimal setup, making it accessible for any user with a Spotify account.

## Key Features

### 1. **Playlist Scheduling and Automation**
   - Users can pre-select playlists for specific time slots or arrange them to play in a sequence, ensuring a smooth flow of music throughout the event.
   - The app allows playlist scheduling that dynamically updates in real-time, removing the need for a DJ to control song selections manually.

### 2. **Client-Side Architecture**
   - This application is entirely client-side, meaning all processing and rendering occur within the user’s browser. The app communicates directly with the Spotify Web API to retrieve and manage playlists, ensuring quick responses without needing a dedicated backend.
   - Client-side architecture keeps it lightweight, with easy setup and deployment, requiring only a Spotify account and API credentials.

### 3. **Dynamic Playlist Management**
   - Users can interact with playlists by adding, removing, or reordering songs within the app.
   - Guests can contribute to the music experience by adding songs to the currently active playlist, creating a collaborative atmosphere where everyone can enjoy their favorite tracks.

### 4. **Interactive UI with Real-Time Updates**
   - **Fly-in Animations**: Playlist cards animate into view with a fly-in effect, creating a lively and engaging user interface when the app loads.
   - **Hover Effects**: Each playlist card scales up slightly when hovered over, signaling interactivity and encouraging users to explore more of the app.
   - **Intuitive Navigation**: The sidebar provides simple navigation options, including `Home`, `Schedule`, and `Events`, ensuring users can quickly access different app features.

### 5. **Spotify API Integration**
   - **Automatic Authentication**: Users can log in with their Spotify credentials, giving the app access to their playlists and song library.
   - **Real-Time Playback Control**: Once a playlist is scheduled, users can control playback through Spotify-connected devices, allowing the event to seamlessly stream music on available speakers.

### 6. **Event-Driven Music Scheduling**
   - Users can set playlists to play based on different time slots, making it easy to transition from one vibe to another (e.g., background music during dinner, dance music later in the evening).
   - Guests can contribute to the experience by adding songs that will seamlessly integrate with the set schedule, creating a custom event soundtrack.

### 7. **Responsive Design**
   - The app is built with responsive design principles, ensuring a seamless experience across desktop, tablet, and mobile devices.
   - This makes it easy for anyone, whether a host or guest, to interact with the app from any device during the event.

## Technologies Used

- **React**: For building the user interface and managing component state.
- **Styled-Components**: For modular, scoped styling of components.
- **Spotify Web API**: To retrieve user playlists, manage playback, and allow real-time updates to playlist content.
- **Axios**: For making HTTP requests to the Spotify API and managing user authentication.
- **React Icons**: For a user-friendly iconography in navigation and interactive elements.
