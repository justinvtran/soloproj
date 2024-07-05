document.getElementById('fetchProfile').addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  console.log('Fetch button clicked');
  if (username) {
    try {
      console.log('Fetching profile for:', username);
      const profileResponse = await fetch(`/profile/${username}`);
      const profile = await profileResponse.json();
      console.log('Profile fetched:', profile);
      displayProfile(profile);

      console.log('Fetching playlists for:', username);
      const playlistsResponse = await fetch(`/playlists/${username}`);
      const playlists = await playlistsResponse.json();
      console.log('Playlists fetched:', playlists);
      displayPlaylists(playlists);
    } catch (error) {
      console.error('Error fetching data:', error);
      document.getElementById('profile').innerText = 'Error fetching profile or playlists';
    }
  } else {
    alert('Please enter a Spotify username');
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
