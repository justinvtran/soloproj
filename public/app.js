
document.getElementById('fetchProfile').addEventListener('click', async () => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const access_token = params.get('access_token');
  
  if (access_token) {
    try {
      document.getElementById('fetchProfile').textContent = 'Generate a Playlist!';
      document.getElementById('fetchProfile').addEventListener('click', generatePlaylist);
      console.log('Fetching profile');
      const profileResponse = await fetch(`/profile?access_token=${access_token}`);
      const profile = await profileResponse.json();
      console.log('Profile fetched:', profile);
      displayProfile(profile);

      console.log('Fetching playlists');
      const playlistsResponse = await fetch(`/playlists?access_token=${access_token}`);
      const playlists = await playlistsResponse.json();
      console.log('Playlists fetched:', playlists);
      displayPlaylists(playlists);

      console.log('Fetching top tracks');
      const topTracksResponse = await fetch(`/top-tracks?access_token=${access_token}`);
      const topTracks = await topTracksResponse.json();
      console.log('Top tracks fetched:', topTracks);
      displayTopTracks(topTracks);

      console.log('Fetching top artists');
      const topArtistsResponse = await fetch(`/top-artists?access_token=${access_token}`);
      const topArtists = await topArtistsResponse.json();
      console.log('Top artists fetched:', topArtists);
      displayTopArtists(topArtists);

      // document.getElementById('description').style.display = 'none';
      // document.getElementById('fetchProfile').textContent = 'Generate Playlist';
      // document.getElementById('fetchProfile').addEventListener('click', generatePlaylist);
      showLogoutButton(); // show logout button after fetching data
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('profile').innerText = 'Error fetching profile, playlists, top tracks, or top artists';
    }
  } else {
    window.location = '/login';  // Redirect to login if no access token
  }
});

function displayProfile(profile) {
  const profileDiv = document.getElementById('profile');
  profileDiv.innerHTML = `
    <h2>${profile.display_name}</h2>
    <img src="${profile.images[0]?.url}" alt="Profile Image" width="100">
    <p>Followers: ${profile.followers.total}</p>
    <p>Profile Link: <a href="${profile.external_urls.spotify}" target="_blank">Open in Spotify</a></p>
  `;
}

function displayPlaylists(playlists) {
  const playlistsDiv = document.getElementById('playlists');
  playlistsDiv.innerHTML = '<h3>Public Playlists:</h3>';
  playlistsDiv.style.display = 'flex'; // Ensure playlists container is flex
  playlistsDiv.style.flexDirection = 'column';
  playlistsDiv.style.alignItems = 'center';

  if (playlists.items.length === 0) {
    playlistsDiv.innerHTML += '<p>No public playlists found</p>';
  } else {
    playlists.items.forEach(playlist => {
      playlistsDiv.innerHTML += `
        <div class="playlist">
          <img src="${playlist.images[0]?.url}" alt="Playlist Image">
          <p><a href="${playlist.external_urls.spotify}" target="_blank">${playlist.name}</a></p>
          <p>${playlist.tracks.total} tracks</p>
        </div>
      `;
    });
  }
}

function displayTopTracks(topTracks) {
  const topTracksDiv = document.getElementById('topTracks');
  topTracksDiv.innerHTML = '<h3>Top Tracks:</h3>';
  topTracksDiv.style.display = 'flex'; // Ensure top tracks container is flex
  topTracksDiv.style.flexDirection = 'column';
  topTracksDiv.style.alignItems = 'center';

  if (topTracks.items.length === 0) {
    topTracksDiv.innerHTML += '<p>No top tracks found</p>';
  } else {
    topTracks.items.forEach(track => {
      topTracksDiv.innerHTML += `
        <div class="track">
          <img src="${track.album.images[0]?.url}" alt="Track Image">
          <p><a href="${track.external_urls.spotify}" target="_blank">${track.name}</a> by ${track.artists.map(artist => artist.name).join(', ')}</p>
          <p>Album: ${track.album.name}</p>
        </div>
      `;
    });
  }
}

function displayTopArtists(topArtists) {
  const topArtistsDiv = document.getElementById('topArtists');
  topArtistsDiv.innerHTML = '<h3>Top Artists:</h3>';
  topArtistsDiv.style.display = 'flex'; // Ensure top artists container is flex
  topArtistsDiv.style.flexDirection = 'column';
  topArtistsDiv.style.alignItems = 'center';

  if (topArtists.items.length === 0) {
    topArtistsDiv.innerHTML += '<p>No top artists found</p>';
  } else {
    topArtists.items.forEach(artist => {
      topArtistsDiv.innerHTML += `
        <div class="artist">
          <img src="${artist.images[0]?.url}" alt="Artist Image">
          <p><a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a></p>
          <p>Followers: ${artist.followers.total}</p>
        </div>
      `;
    });
  }
}

function generatePlaylist() {
  console.log('Generating playlist...');
  // generate playlist logic 
}

// function showLogoutButton() {
//   if (!document.getElementById('logout')) {
//     const logoutButton = document.createElement('button');
//     logoutButton.id = 'logout';
//     logoutButton.textContent = 'Logout';
//     logoutButton.addEventListener('click', () => {
//       localStorage.removeItem('access_token');
//       window.location = '/login';
//     });
//     document.body.appendChild(logoutButton);
//   }
// }

function showLogoutButton() {
  if (!document.getElementById('logout')) {
    const container = document.querySelector('.container');
    const logoutButton = document.createElement('button');
    logoutButton.id = 'logout';
    logoutButton.textContent = 'Logout';
    logoutButton.style.position = 'absolute';
    logoutButton.style.top = '10px';
    logoutButton.style.left = '10px';
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('access_token');
      fetch('/logout').then(() => {
        window.location = '/login';
      });
    });
    container.appendChild(logoutButton);
  }
}
